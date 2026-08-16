import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './gateways/chat.gateway';
import { InterestGateway } from './gateways/interest.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
  ],
  providers: [ChatGateway, InterestGateway],
})
export class RealtimeModule {}
