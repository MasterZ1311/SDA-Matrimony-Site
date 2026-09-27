import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('NOTIFICATION_GATEWAY');

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        return;
      }

      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) return;

      const payload = jwt.verify(token, secret) as any;
      if (payload?.sub) {
        client.data.userId = payload.sub;
        client.join(`user_${payload.sub}`);
        this.logger.log(`Socket ${client.id} joined user_${payload.sub}`);
      }
    } catch (e: any) {
      this.logger.warn(`Notification socket auth note: ${e.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      client.leave(`user_${userId}`);
    }
  }

  @SubscribeMessage('join_user_room')
  handleJoinUserRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      client.join(`user_${userId}`);
      return { status: 'joined', room: `user_${userId}` };
    }
    return { error: 'Unauthorized' };
  }

  emitNewNotification(userId: string, notification: any, unreadCount?: number) {
    if (!this.server) {
      this.logger.warn('WebSocket server not initialized yet');
      return;
    }
    this.server.to(`user_${userId}`).emit('notification:new', notification);
    if (typeof unreadCount === 'number') {
      this.server.to(`user_${userId}`).emit('notification:unread-count', {
        count: unreadCount,
      });
    }
  }

  emitUnreadCount(userId: string, count: number) {
    if (!this.server) {
      this.logger.warn('WebSocket server not initialized yet');
      return;
    }
    this.server.to(`user_${userId}`).emit('notification:unread-count', { count });
  }
}
