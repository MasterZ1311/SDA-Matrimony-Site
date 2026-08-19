import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterestsService } from './interests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InterestStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class ExpressInterestDto {
  @ApiProperty({ description: 'Target candidate User ID', example: 'uuid-candidate-id' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiPropertyOptional({ description: 'Respectful Christian introduction message' })
  @IsString()
  @IsOptional()
  introMessage?: string;
}

export class RespondInterestDto {
  @ApiProperty({ enum: [InterestStatus.ACCEPTED, InterestStatus.DECLINED], example: InterestStatus.ACCEPTED })
  @IsEnum(InterestStatus)
  @IsNotEmpty()
  status: InterestStatus;
}

@ApiTags('Expressions of Interest')
@Controller('interests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post('express')
  @ApiOperation({ summary: 'Send an expression of matrimonial interest to a candidate' })
  async expressInterest(
    @CurrentUser('id') userId: string,
    @Body() dto: ExpressInterestDto,
  ) {
    return this.interestsService.expressInterest(userId, dto.receiverId, dto.introMessage);
  }

  @Get('received')
  @ApiOperation({ summary: 'List all matrimonial expressions received by the member' })
  async getReceived(@CurrentUser('id') userId: string) {
    return this.interestsService.getReceivedInterests(userId);
  }

  @Get('sent')
  @ApiOperation({ summary: 'List all expressions of interest sent by the member' })
  async getSent(@CurrentUser('id') userId: string) {
    return this.interestsService.getSentInterests(userId);
  }

  @Put(':id/respond')
  @ApiOperation({ summary: 'Accept or decline a received matrimonial interest' })
  async respond(
    @CurrentUser('id') userId: string,
    @Param('id') interestId: string,
    @Body() dto: RespondInterestDto,
  ) {
    return this.interestsService.respondToInterest(userId, interestId, dto.status);
  }

  @Delete(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw a sent expression of interest' })
  async withdraw(
    @CurrentUser('id') userId: string,
    @Param('id') interestId: string,
  ) {
    return this.interestsService.withdrawInterest(userId, interestId);
  }
}
