import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InterestStatus } from '@prisma/client';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async expressInterest(senderId: string, receiverId: string, introMessage?: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot express matrimonial interest in yourself.');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
      include: { profile: true },
    });

    if (!receiver || !receiver.profile) {
      throw new NotFoundException('Candidate profile does not exist.');
    }

    // Check existing interest
    const existing = await this.prisma.interestRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });

    if (existing && existing.status === InterestStatus.PENDING) {
      throw new ConflictException('You have already sent a pending expression of interest to this candidate.');
    }

    if (existing && existing.status === InterestStatus.BLOCKED) {
      throw new ForbiddenException('Unable to express interest.');
    }

    const interest = await this.prisma.interestRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
      update: {
        status: InterestStatus.PENDING,
        introMessage: introMessage?.trim() || 'Greetings, I would be honored to connect and discuss our Christian journey.',
      },
      create: {
        senderId,
        receiverId,
        status: InterestStatus.PENDING,
        introMessage: introMessage?.trim() || 'Greetings, I would be honored to connect and discuss our Christian journey.',
      },
      include: {
        sender: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        receiver: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
      },
    });

    return {
      message: 'Expression of interest sent successfully.',
      interest,
    };
  }

  async getReceivedInterests(userId: string) {
    return this.prisma.interestRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          include: {
            profile: {
              include: {
                spiritualProfile: { include: { division: true, conference: true, localChurch: true } },
                lifestyleProfile: true,
                educationCareer: true,
                photos: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSentInterests(userId: string) {
    return this.prisma.interestRequest.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          include: {
            profile: {
              include: {
                spiritualProfile: { include: { division: true, conference: true, localChurch: true } },
                lifestyleProfile: true,
                educationCareer: true,
                photos: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respondToInterest(userId: string, interestId: string, status: InterestStatus) {
    if (status !== InterestStatus.ACCEPTED && status !== InterestStatus.DECLINED) {
      throw new BadRequestException('Response status must be ACCEPTED or DECLINED.');
    }

    const interest = await this.prisma.interestRequest.findUnique({
      where: { id: interestId },
    });

    if (!interest) {
      throw new NotFoundException('Interest request not found.');
    }

    // Strict Authorization: Only the receiver can accept or decline
    if (interest.receiverId !== userId) {
      throw new ForbiddenException('Only the designated recipient can respond to this interest request.');
    }

    const updated = await this.prisma.interestRequest.update({
      where: { id: interestId },
      data: { status },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    // If accepted, automatically establish conversation
    if (status === InterestStatus.ACCEPTED) {
      await this.prisma.conversation.upsert({
        where: {
          user1Id_user2Id: {
            user1Id: interest.senderId,
            user2Id: interest.receiverId,
          },
        },
        update: {},
        create: {
          user1Id: interest.senderId,
          user2Id: interest.receiverId,
        },
      });
    }

    return {
      message: `Interest request status updated to ${status}.`,
      interest: updated,
    };
  }

  async withdrawInterest(userId: string, interestId: string) {
    const interest = await this.prisma.interestRequest.findUnique({
      where: { id: interestId },
    });

    if (!interest) {
      throw new NotFoundException('Interest request not found.');
    }

    // Strict Authorization: Only the sender can withdraw
    if (interest.senderId !== userId) {
      throw new ForbiddenException('Only the sender can withdraw this expression of interest.');
    }

    await this.prisma.interestRequest.delete({
      where: { id: interestId },
    });

    return {
      message: 'Expression of interest withdrawn successfully.',
      interestId,
    };
  }
}
