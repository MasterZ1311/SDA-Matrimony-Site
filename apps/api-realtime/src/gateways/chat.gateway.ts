import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaClient, InterestStatus } from '@prisma/client';

const prisma = new PrismaClient();

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('CHAT_GATEWAY');
  private activeUsers = new Map<string, string>(); // userId -> socketId

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        this.logger.error('JWT_ACCESS_SECRET is not defined');
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, secret) as any;
      client.data.userId = payload.sub;

      this.activeUsers.set(payload.sub, client.id);
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);

      // Broadcast presence
      this.server.emit('user_status', { userId: payload.sub, status: 'ONLINE' });
    } catch (e) {
      this.logger.error(`Unauthorized connection attempt: ${e.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.activeUsers.delete(userId);
      this.server.emit('user_status', { userId, status: 'OFFLINE' });
      this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId) return { error: 'Unauthorized' };

    const conversation = await prisma.conversation.findUnique({
      where: { id: data.conversationId },
    });

    if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
      return { error: 'Forbidden: You are not a participant in this conversation' };
    }

    client.join(`conv_${data.conversationId}`);
    return { status: 'joined', conversationId: data.conversationId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const senderId = client.data.userId;
    if (!senderId) return { error: 'Unauthorized' };

    if (!data.content || !data.content.trim()) {
      return { error: 'Message content cannot be empty.' };
    }

    // Strict Authorization: User must belong to conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: data.conversationId },
    });

    if (!conversation || (conversation.user1Id !== senderId && conversation.user2Id !== senderId)) {
      return { error: 'Forbidden: Unauthorized to send message to this conversation' };
    }

    const receiverId = conversation.user1Id === senderId ? conversation.user2Id : conversation.user1Id;

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: data.conversationId,
        senderId,
        content: data.content.trim(),
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    // Broadcast message to conversation room
    this.server.to(`conv_${data.conversationId}`).emit('new_message', message);

    // Also send direct alert to receiver if online
    const receiverSocketId = this.activeUsers.get(receiverId);
    if (receiverSocketId) {
      const senderName = message.sender.profile
        ? `${message.sender.profile.firstName} ${message.sender.profile.lastName}`.trim()
        : (message.sender.email || 'A member');
      this.server.to(receiverSocketId).emit('message_notification', {
        senderName,
        content: data.content.trim(),
        conversationId: data.conversationId,
      });
    }

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId;
    client.to(`conv_${data.conversationId}`).emit('user_typing', {
      userId,
      isTyping: data.isTyping,
    });
  }
}
