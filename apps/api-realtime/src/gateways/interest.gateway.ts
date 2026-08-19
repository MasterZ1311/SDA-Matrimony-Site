import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaClient, InterestStatus } from '@prisma/client';

const prisma = new PrismaClient();

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class InterestGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_interest')
  async handleSendInterest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; introMessage?: string },
  ) {
    const senderId = client.data.userId;
    if (!senderId) return { error: 'Unauthorized' };

    if (senderId === data.receiverId) {
      return { error: 'Cannot send matrimonial interest to yourself.' };
    }

    const receiver = await prisma.user.findUnique({
      where: { id: data.receiverId },
      include: { profile: true },
    });

    if (!receiver || !receiver.profile) {
      return { error: 'Candidate profile does not exist.' };
    }

    const interest = await prisma.interestRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId: data.receiverId,
        },
      },
      update: {
        status: InterestStatus.PENDING,
        introMessage: data.introMessage?.trim() || 'Greetings, I would be honored to connect and discuss our Christian journey.',
      },
      create: {
        senderId,
        receiverId: data.receiverId,
        status: InterestStatus.PENDING,
        introMessage: data.introMessage?.trim() || 'Greetings, I would be honored to connect and discuss our Christian journey.',
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    this.server.emit(`user_${data.receiverId}_interest`, {
      type: 'INTEREST_RECEIVED',
      interest,
    });

    return interest;
  }

  @SubscribeMessage('respond_interest')
  async handleRespondInterest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { interestId: string; status: InterestStatus },
  ) {
    const userId = client.data.userId;
    if (!userId) return { error: 'Unauthorized' };

    const interest = await prisma.interestRequest.findUnique({
      where: { id: data.interestId },
    });

    if (!interest) {
      return { error: 'Interest request not found.' };
    }

    // Strict Authorization: Only the receiver can accept or decline
    if (interest.receiverId !== userId) {
      return { error: 'Forbidden: You can only respond to interest requests sent to you' };
    }

    const updated = await prisma.interestRequest.update({
      where: { id: data.interestId },
      data: { status: data.status },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    // If accepted, automatically ensure Conversation exists
    if (data.status === InterestStatus.ACCEPTED) {
      await prisma.conversation.upsert({
        where: {
          user1Id_user2Id: {
            user1Id: updated.senderId,
            user2Id: updated.receiverId,
          },
        },
        update: {},
        create: {
          user1Id: updated.senderId,
          user2Id: updated.receiverId,
        },
      });
    }

    this.server.emit(`user_${updated.senderId}_interest`, {
      type: 'INTEREST_STATUS_UPDATED',
      interest: updated,
    });

    return updated;
  }
}
