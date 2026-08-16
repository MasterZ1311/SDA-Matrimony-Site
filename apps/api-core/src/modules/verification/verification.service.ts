import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus, UserRole } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async submitPastoralReference(userId: string, data: {
    pastorName: string;
    pastorEmail: string;
    pastorPhone?: string;
    churchName: string;
    conferenceName: string;
    referenceNotes?: string;
  }) {
    const token = crypto.randomBytes(32).toString('hex');

    const verification = await this.prisma.pastoralVerification.create({
      data: {
        userId,
        pastorName: data.pastorName,
        pastorEmail: data.pastorEmail.toLowerCase(),
        pastorPhone: data.pastorPhone,
        churchName: data.churchName,
        conferenceName: data.conferenceName,
        referenceNotes: data.referenceNotes,
        verificationToken: token,
        status: VerificationStatus.SUBMITTED_PENDING_PASTOR,
      },
    });

    await this.prisma.profile.update({
      where: { userId },
      data: { verificationStatus: VerificationStatus.SUBMITTED_PENDING_PASTOR },
    });

    return {
      message: 'Pastoral verification submitted successfully. Verification token generated.',
      verificationId: verification.id,
      verificationToken: token,
    };
  }

  async verifyByToken(token: string, isEndorsed: boolean, pastorComments?: string) {
    const verification = await this.prisma.pastoralVerification.findUnique({
      where: { verificationToken: token },
    });

    if (!verification) {
      throw new NotFoundException('Invalid or expired verification token.');
    }

    const newStatus = isEndorsed ? VerificationStatus.PASTOR_ENDORSED : VerificationStatus.REJECTED;

    const updated = await this.prisma.pastoralVerification.update({
      where: { id: verification.id },
      data: {
        status: newStatus,
        pastorComments,
        verifiedAt: new Date(),
      },
    });

    await this.prisma.profile.update({
      where: { userId: verification.userId },
      data: { verificationStatus: newStatus },
    });

    return {
      message: `Pastoral endorsement successfully processed as ${newStatus}.`,
      verification: updated,
    };
  }

  async listPendingVerifications() {
    return this.prisma.pastoralVerification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async adminApproveVerification(verificationId: string, isApproved: boolean) {
    const verification = await this.prisma.pastoralVerification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) throw new NotFoundException('Verification request not found.');

    const newStatus = isApproved ? VerificationStatus.ADMIN_APPROVED : VerificationStatus.REJECTED;

    await this.prisma.pastoralVerification.update({
      where: { id: verificationId },
      data: { status: newStatus },
    });

    await this.prisma.profile.update({
      where: { userId: verification.userId },
      data: { verificationStatus: newStatus },
    });

    if (isApproved) {
      await this.prisma.user.update({
        where: { id: verification.userId },
        data: { role: UserRole.VERIFIED_MEMBER },
      });
    }

    return { message: `Verification status updated to ${newStatus}.` };
  }
}
