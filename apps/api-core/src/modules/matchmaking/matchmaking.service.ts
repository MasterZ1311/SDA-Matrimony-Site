import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum MatchSuggestionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class MatchmakingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates an admin-assisted match suggestion between two candidates.
   */
  async createSuggestion(
    adminId: string,
    data: {
      userId: string;
      suggestedUserId: string;
      adminNote?: string;
    },
  ) {
    if (data.userId === data.suggestedUserId) {
      throw new BadRequestException('Cannot suggest a candidate to themselves.');
    }

    // Verify recipient user exists
    const user = await (this.prisma as any).user.findUnique({
      where: { id: data.userId },
      include: { profile: true },
    });
    if (!user) {
      throw new NotFoundException('Recipient user receiving the suggestion was not found.');
    }

    // Verify suggested user exists
    const suggestedUser = await (this.prisma as any).user.findUnique({
      where: { id: data.suggestedUserId },
      include: { profile: true },
    });
    if (!suggestedUser) {
      throw new NotFoundException('Candidate suggested for match was not found.');
    }

    // Check for existing pending suggestion
    const existing = await (this.prisma as any).matchSuggestion.findFirst({
      where: {
        userId: data.userId,
        suggestedUserId: data.suggestedUserId,
        status: MatchSuggestionStatus.PENDING,
      },
    });
    if (existing) {
      throw new ConflictException(
        'An active pending match suggestion already exists between these candidates.',
      );
    }

    return (this.prisma as any).matchSuggestion.create({
      data: {
        adminId,
        userId: data.userId,
        suggestedUserId: data.suggestedUserId,
        adminNote: data.adminNote,
        status: MatchSuggestionStatus.PENDING,
      },
      include: {
        admin: {
          select: { id: true, email: true },
        },
        user: {
          include: { profile: true },
        },
        suggestedUser: {
          include: { profile: true },
        },
      },
    });
  }

  /**
   * Lists all match suggestions for administrators, optionally filterable by status.
   */
  async listAllSuggestions(status?: MatchSuggestionStatus) {
    return (this.prisma as any).matchSuggestion.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, email: true },
        },
        user: {
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                gender: true,
                verificationStatus: true,
                residenceCity: true,
                residenceCountry: true,
              },
            },
          },
        },
        suggestedUser: {
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                gender: true,
                verificationStatus: true,
                residenceCity: true,
                residenceCountry: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Returns all pending match suggestions for a specific authenticated member.
   */
  async getSuggestedMatchesForUser(userId: string) {
    return (this.prisma as any).matchSuggestion.findMany({
      where: {
        userId,
        status: MatchSuggestionStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        suggestedUser: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                dateOfBirth: true,
                residenceCity: true,
                residenceCountry: true,
                maritalStatus: true,
                bioSummary: true,
                verificationStatus: true,
                photos: {
                  where: { isPrimary: true },
                  select: { id: true, url: true, isApproved: true },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Allows the recipient member to accept or reject an admin-suggested match.
   */
  async respondToSuggestion(suggestionId: string, userId: string, accepted: boolean) {
    const suggestion = await (this.prisma as any).matchSuggestion.findUnique({
      where: { id: suggestionId },
    });

    if (!suggestion) {
      throw new NotFoundException('Match suggestion not found.');
    }

    if (suggestion.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to respond to this match suggestion.',
      );
    }

    if (suggestion.status !== MatchSuggestionStatus.PENDING) {
      throw new BadRequestException(
        `This match suggestion has already been resolved with status: ${suggestion.status}.`,
      );
    }

    const newStatus = accepted
      ? MatchSuggestionStatus.ACCEPTED
      : MatchSuggestionStatus.REJECTED;

    return (this.prisma as any).matchSuggestion.update({
      where: { id: suggestionId },
      data: { status: newStatus },
      include: {
        suggestedUser: {
          include: { profile: true },
        },
      },
    });
  }
}
