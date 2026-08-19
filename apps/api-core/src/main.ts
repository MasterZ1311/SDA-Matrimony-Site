import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('SDA_API_BOOTSTRAP');
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  const prefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(prefix);

  // Enable CORS
  const configuredOrigin = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const allowedOrigins = configuredOrigin
    ? [...new Set([...configuredOrigin.split(',').map((o) => o.trim()), ...defaultOrigins])]
    : defaultOrigins;

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Pipelines & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Seventh-day Adventist (SDA) Matrimony Platform API')
    .setDescription('Core Enterprise Business Logic, Authentication, Profiles, Church Hierarchy, and Verification APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 SDA Matrimony Core API is running on: http://localhost:${port}/${prefix}`);
  logger.log(`📖 Interactive Swagger Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
