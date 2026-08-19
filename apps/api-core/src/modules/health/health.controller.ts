import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness and database connectivity health check' })
  @ApiResponse({ status: 200, description: 'Service is operational and database is connected.' })
  @ApiResponse({ status: 503, description: 'Service or database is unhealthy.' })
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Database connectivity check failed',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
