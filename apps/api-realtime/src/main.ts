import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { RealtimeModule } from './realtime.module';

async function bootstrap() {
  const logger = new Logger('SDA_REALTIME_WS');
  const app = await NestFactory.create(RealtimeModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.WS_PORT || 4001;
  await app.listen(port);
  logger.log(`⚡ SDA Real-time WebSocket Gateway is listening on port ${port}`);
}

bootstrap();
