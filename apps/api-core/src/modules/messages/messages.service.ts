import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        user2: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => {
      const isUser1 = conv.user1Id === userId;
      const otherUser = isUser1 ? conv.user2 : conv.user1;
      const lastMsg = conv.messages[0] || null;

      return {
        id: conv.id,
        participantId: otherUser.id,
        participantEmail: otherUser.email,
        participantProfile: otherUser.profile,
        lastMessage: lastMsg ? lastMsg.content : null,
        lastMessageTime: lastMsg ? lastMsg.createdAt : conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });
  }

  async getConversationMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    // Strict Authorization: User must be user1 or user2
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You are not authorized to view this conversation.');
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: { conversationId },
      include: {
        sender: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      conversation,
      messages,
    };
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    if (!content || !content.trim()) {
      throw new BadRequestException('Message content cannot be empty.');
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    // Strict Authorization: User must be user1 or user2
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You are not authorized to send messages in this conversation.');
    }

    // Check if either user has blocked the other
    const otherUserId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
    const block = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { userId, blockedUserId: otherUserId },
          { userId: otherUserId, blockedUserId: userId },
        ],
      },
    });
    if (block) {
      throw new ForbiddenException('Communication restricted due to user blocking settings.');
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim(),
      },
      include: {
        sender: {
          include: {
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
      },
    });

    // Update conversation updatedAt timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getIcebreakers(userId: string, targetUserId: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: {
          include: {
            educationCareer: true,
            spiritualProfile: true,
            lifestyleProfile: true,
          },
        },
      },
    });

    if (!targetUser || !targetUser.profile) {
      throw new NotFoundException('Candidate profile not found.');
    }

    const p = targetUser.profile;
    const name = p.firstName || 'Candidate';
    const occ = p.educationCareer?.occupation || '';
    const inst = p.educationCareer?.institution || '';
    const city = p.residenceCity || '';

    const icebreakers: string[] = [
      `Happy Sabbath ${name}! What are some of your favorite Sabbath traditions and afternoon nature spots?`,
      `Greetings ${name}! I noticed your involvement with church ministry. How did you feel called into that service?`,
      `Hello ${name}! What is a favorite Bible promise or scripture that has been blessing you recently?`,
    ];

    if (occ) {
      icebreakers.push(`Hi ${name}, I saw that you work as a ${occ}. How do you see your career intersecting with your Christian mission?`);
    } else if (inst) {
      icebreakers.push(`Hi ${name}, I saw you attended ${inst}. What was your experience like with Adventist education?`);
    } else if (city) {
      icebreakers.push(`Hi ${name}, how is the Adventist church community around ${city}?`);
    } else {
      icebreakers.push(`Hello ${name}! It's a pleasure to connect with you. What are some of your favorite Christian hymns or praise songs?`);
    }

    return {
      targetUserId,
      targetName: name,
      icebreakers,
    };
  }
}

