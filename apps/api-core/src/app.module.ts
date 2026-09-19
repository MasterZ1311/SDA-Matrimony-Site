import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChurchModule } from './modules/church/church.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { VerificationModule } from './modules/verification/verification.module';
import { BiodataModule } from './modules/biodata/biodata.module';
import { InterestsModule } from './modules/interests/interests.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ChurchModule,
    ProfilesModule,
    VerificationModule,
    BiodataModule,
    InterestsModule,
    MessagesModule,
    MailModule,
  ],
})
export class AppModule {}
