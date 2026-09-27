import { Body, Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification.gateway';

@Controller('internal/notifications')
export class InternalNotificationsController {
  private readonly logger = new Logger(InternalNotificationsController.name);

  constructor(private readonly notificationGateway: NotificationGateway) {}

  @Post('emit')
  @HttpCode(HttpStatus.OK)
  emitNotification(
    @Body() body: { userId: string; notification: any; unreadCount?: number },
  ) {
    if (!body?.userId || !body?.notification) {
      return { success: false, message: 'Invalid payload' };
    }

    this.logger.log(`Dispatching realtime notification to user ${body.userId}`);
    this.notificationGateway.emitNewNotification(
      body.userId,
      body.notification,
      body.unreadCount,
    );

    return { success: true };
  }

  @Post('emit-unread-count')
  @HttpCode(HttpStatus.OK)
  emitUnreadCount(@Body() body: { userId: string; unreadCount: number }) {
    if (!body?.userId || typeof body?.unreadCount !== 'number') {
      return { success: false, message: 'Invalid payload' };
    }

    this.logger.log(`Dispatching unread count ${body.unreadCount} to user ${body.userId}`);
    this.notificationGateway.emitUnreadCount(body.userId, body.unreadCount);

    return { success: true };
  }
}
