import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './gateways/chat.gateway';
import { InterestGateway } from './gateways/interest.gateway';
import { NotificationGateway } from './gateways/notification.gateway';
import { InternalNotificationsController } from './controllers/internal-notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
  ],
  controllers: [InternalNotificationsController],
  providers: [ChatGateway, InterestGateway, NotificationGateway],
})
export class RealtimeModule {}

