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
}
