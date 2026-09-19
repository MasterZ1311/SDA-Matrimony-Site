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

    // Check if either user has blocked the other
    const blockExists = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { userId: senderId, blockedUserId: receiverId },
          { userId: receiverId, blockedUserId: senderId },
        ],
      },
    });

    if (blockExists) {
      throw new ForbiddenException('Unable to express interest due to user communication settings.');
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

  async toggleShortlist(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot shortlist your own profile.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true },
    });

    if (!targetUser || !targetUser.profile) {
      throw new NotFoundException('Candidate profile does not exist.');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId,
        },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });
      return {
        isFavorited: false,
        message: 'Profile removed from your shortlisted favorites.',
      };
    } else {
      await this.prisma.favorite.create({
        data: {
          userId,
          targetUserId,
        },
      });
      return {
        isFavorited: true,
        message: 'Profile saved to your shortlisted favorites for prayerful consideration ⭐',
      };
    }
  }

  async getShortlist(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        targetUser: {
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

    return favorites.map((f) => ({
      favoriteId: f.id,
      savedAt: f.createdAt,
      user: {
        id: f.targetUser.id,
        email: f.targetUser.email,
        role: f.targetUser.role,
      },
      profile: f.targetUser.profile,
    }));
  }

  async getNotifications(userId: string) {
    const [pendingReceived, acceptedMatches] = await Promise.all([
      this.prisma.interestRequest.findMany({
        where: { receiverId: userId, status: InterestStatus.PENDING },
        include: {
          sender: {
            include: {
              profile: {
                include: { photos: { where: { isPrimary: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.interestRequest.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          status: InterestStatus.ACCEPTED,
        },
        include: {
          sender: {
            include: { profile: { include: { photos: { where: { isPrimary: true } } } } },
          },
          receiver: {
            include: { profile: { include: { photos: { where: { isPrimary: true } } } } },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    const notifications: Array<{
      id: string;
      type: 'proposal' | 'match';
      title: string;
      message: string;
      avatarUrl?: string;
      link: string;
      date: Date;
    }> = [];

    pendingReceived.forEach((item) => {
      const senderProfile = item.sender.profile;
      const senderName = senderProfile ? `${senderProfile.firstName} ${senderProfile.lastName}`.trim() : 'Adventist Member';
      notifications.push({
        id: `prop-${item.id}`,
        type: 'proposal',
        title: 'New Matrimonial Proposal',
        message: `${senderName} expressed interest in connecting with you.`,
        avatarUrl: senderProfile?.photos?.[0]?.url,
        link: '/interests',
        date: item.createdAt,
      });
    });

    acceptedMatches.forEach((item) => {
      const otherUser = item.senderId === userId ? item.receiver : item.sender;
      const otherProfile = otherUser.profile;
      const otherName = otherProfile ? `${otherProfile.firstName} ${otherProfile.lastName}`.trim() : 'Match';
      notifications.push({
        id: `match-${item.id}`,
        type: 'match',
        title: 'Connected Match',
        message: `You and ${otherName} are connected! Start a Christ-centered conversation.`,
        avatarUrl: otherProfile?.photos?.[0]?.url,
        link: '/messages',
        date: item.updatedAt,
      });
    });

    return {
      totalUnread: pendingReceived.length,
      pendingCount: pendingReceived.length,
      matchCount: acceptedMatches.length,
      notifications,
    };
  }
}
