import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

export { NotificationType };

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Persists a notification to PostgreSQL and dispatches an asynchronous realtime push.
   * Realtime network errors are caught and logged without disrupting the caller.
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    link: string,
    relatedId?: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        link,
        relatedId,
        isRead: false,
      },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    // Fire-and-forget realtime push to api-realtime
    this.dispatchRealtimePush(userId, notification, unreadCount).catch((err) => {
      this.logger.warn(
        `Realtime push skipped (realtime service unreachable): ${err.message}`,
      );
    });

    return notification;
  }

  /**
   * Returns recent notifications for the authenticated user, limited to latest 30.
   */
  async getNotifications(userId: string, limit = 30) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Returns the count of unread notifications for the authenticated user.
   */
  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  /**
   * Marks a single notification as read, enforcing strict user ownership.
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this notification.',
      );
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    this.dispatchRealtimeUnreadCount(userId, unreadCount).catch(() => {});

    return updated;
  }

  /**
   * Marks all unread notifications for the user as read.
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    this.dispatchRealtimeUnreadCount(userId, 0).catch(() => {});

    return { updatedCount: result.count, count: 0 };
  }

  /**
   * Dispatches new notification payload to api-realtime gateway via internal endpoint.
   */
  private async dispatchRealtimePush(
    userId: string,
    notification: any,
    unreadCount: number,
  ) {
    const realtimeUrl =
      this.configService.get<string>('REALTIME_SERVICE_URL') ||
      process.env.REALTIME_SERVICE_URL ||
      'http://localhost:4001';

    await axios.post(
      `${realtimeUrl}/internal/notifications/emit`,
      { userId, notification, unreadCount },
      { timeout: 2000 },
    );
  }

  /**
   * Dispatches updated unread count to api-realtime gateway.
   */
  private async dispatchRealtimeUnreadCount(userId: string, unreadCount: number) {
    const realtimeUrl =
      this.configService.get<string>('REALTIME_SERVICE_URL') ||
      process.env.REALTIME_SERVICE_URL ||
      'http://localhost:4001';

    await axios.post(
      `${realtimeUrl}/internal/notifications/emit-unread-count`,
      { userId, unreadCount },
      { timeout: 2000 },
    );
  }
}
