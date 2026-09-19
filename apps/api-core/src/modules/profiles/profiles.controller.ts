import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReportMemberDto {
  @ApiProperty({ description: 'Category/Reason for report', example: 'Inappropriate Behavior / Communication' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Optional context details for pastoral review', example: 'Member was sending solicitations.' })
  @IsString()
  @IsOptional()
  details?: string;
}

@ApiTags('Member Profiles & Discovery')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user full matrimonial profile' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update personal, spiritual, lifestyle, and career details' })
  async updateMyProfile(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.profilesService.updateProfile(userId, data);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search and filter candidate profiles by SDA faith criteria' })
  async searchProfiles(@CurrentUser('id') userId: string, @Query() query: any) {
    return this.profilesService.searchProfiles(userId, query);
  }

  @Get('blocked')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all blocked members for the authenticated user' })
  async getBlockedUsers(@CurrentUser('id') userId: string) {
    return this.profilesService.getBlockedUsers(userId);
  }

  @Get('admin/reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pastoral & Admin queue: List all filed member safety reports' })
  async getAdminReports() {
    return this.profilesService.getAdminReports();
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit confidential pastoral safety report against a member profile' })
  async reportProfile(
    @CurrentUser('id') userId: string,
    @Param('id') reportedProfileId: string,
    @Body() dto: ReportMemberDto,
  ) {
    return this.profilesService.reportProfile(userId, reportedProfileId, dto.reason, dto.details);
  }

  @Post(':id/block')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a member from searches, matching, and communication' })
  async blockUser(
    @CurrentUser('id') userId: string,
    @Param('id') targetProfileId: string,
  ) {
    return this.profilesService.blockUser(userId, targetProfileId);
  }

  @Delete(':id/block')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unblock a previously blocked member' })
  async unblockUser(
    @CurrentUser('id') userId: string,
    @Param('id') blockedUserId: string,
  ) {
    return this.profilesService.unblockUser(userId, blockedUserId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed member profile by ID' })
  async getProfileById(@Param('id') profileId: string) {
    return this.profilesService.getProfileById(profileId);
  }
}

