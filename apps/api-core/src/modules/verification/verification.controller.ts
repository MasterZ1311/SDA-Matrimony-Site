import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitPastoralReferenceDto {
  @ApiProperty({ example: 'Pastor Randy Roberts' })
  @IsString()
  @IsNotEmpty()
  pastorName: string;

  @ApiProperty({ example: 'pastor.randy@lluc.org' })
  @IsEmail()
  pastorEmail: string;

  @ApiPropertyOptional({ example: '+1 (909) 558-4570' })
  @IsString()
  @IsOptional()
  pastorPhone?: string;

  @ApiProperty({ example: 'Loma Linda University Church' })
  @IsString()
  @IsNotEmpty()
  churchName: string;

  @ApiProperty({ example: 'Southeastern California Conference' })
  @IsString()
  @IsNotEmpty()
  conferenceName: string;

  @ApiPropertyOptional({ example: 'Active member in regular standing.' })
  @IsString()
  @IsOptional()
  referenceNotes?: string;
}

export class EndorsePastoralTokenDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isEndorsed: boolean;

  @ApiPropertyOptional({ example: 'I confirm the member is in good and regular standing.' })
  @IsString()
  @IsOptional()
  pastorComments?: string;
}

export class AdminReviewDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isApproved: boolean;
}

@ApiTags('Pastoral & Identity Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('pastoral/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit pastoral reference for verification endorsement' })
  async submitPastoralReference(
    @CurrentUser('id') userId: string,
    @Body() data: SubmitPastoralReferenceDto,
  ) {
    return this.verificationService.submitPastoralReference(userId, data);
  }

  @Post('pastoral/endorse/:token')
  @ApiOperation({ summary: 'Pastoral endpoint to approve or reject endorsement via token' })
  async endorseByToken(
    @Param('token') token: string,
    @Body() body: EndorsePastoralTokenDto,
  ) {
    return this.verificationService.verifyByToken(token, body.isEndorsed, body.pastorComments);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin queue: List all pastoral & identity verification requests' })
  async listPendingVerifications() {
    return this.verificationService.listPendingVerifications();
  }

  @Post('admin/review/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin decision: Approve or reject verification request' })
  async adminReview(
    @Param('id') verificationId: string,
    @Body() body: AdminReviewDto,
  ) {
    return this.verificationService.adminApproveVerification(verificationId, body.isApproved);
  }
}
