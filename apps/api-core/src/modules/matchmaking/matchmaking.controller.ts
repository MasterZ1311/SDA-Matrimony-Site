import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { MatchmakingService, MatchSuggestionStatus } from './matchmaking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

export class CreateMatchSuggestionDto {
  @ApiProperty({
    description: 'User ID of the member who will receive the suggestion',
    example: 'd9b2d63d-a233-4f9e-bfb7-3b2d1844b201',
  })
  @IsString()
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: string;

  @ApiProperty({
    description: 'User ID of the candidate being suggested as a prospective match',
    example: 'e1c3f58a-4972-4b2a-8ef0-983271aa9042',
  })
  @IsString()
  @IsNotEmpty({ message: 'Suggested User ID is required.' })
  suggestedUserId: string;

  @ApiPropertyOptional({
    description: 'Optional admin context, compatibility notes, or rationale',
    example: 'Both members serve in Sabbath School leadership and live in Columbia Union.',
  })
  @IsString()
  @IsOptional()
  adminNote?: string;
}

export class QueryMatchSuggestionsDto {
  @ApiPropertyOptional({
    enum: MatchSuggestionStatus,
    description: 'Filter match suggestions by status',
    example: MatchSuggestionStatus.PENDING,
  })
  @IsEnum(MatchSuggestionStatus)
  @IsOptional()
  status?: MatchSuggestionStatus;
}

export class RespondMatchSuggestionDto {
  @ApiProperty({
    description: 'Accept (true) or Reject (false) the admin-assisted match suggestion',
    example: true,
  })
  @IsBoolean()
  accepted: boolean;
}

@ApiTags('Admin-Assisted Matchmaking')
@Controller()
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post('admin/matches/suggest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin: Suggest a prospective match between two members',
  })
  @ApiResponse({
    status: 201,
    description: 'Match suggestion created successfully with PENDING status.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or self-suggestion attempted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Target or suggested user not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'An active pending suggestion already exists between these candidates.',
  })
  async createSuggestion(
    @CurrentUser('id') adminId: string,
    @Body() dto: CreateMatchSuggestionDto,
  ) {
    return this.matchmakingService.createSuggestion(adminId, dto);
  }

  @Get('admin/matches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin: List all match suggestions with optional status filter',
  })
  @ApiResponse({
    status: 200,
    description: 'List of match suggestions retrieved successfully.',
  })
  async listAllSuggestions(@Query() query: QueryMatchSuggestionsDto) {
    return this.matchmakingService.listAllSuggestions(query.status);
  }

  @Get('matches/suggested')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Member: Retrieve all pending match suggestions made for the authenticated member',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending match suggestions with candidate profile cards.',
  })
  async getSuggestedMatches(@CurrentUser('id') userId: string) {
    return this.matchmakingService.getSuggestedMatchesForUser(userId);
  }

  @Post('matches/:id/respond')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Member: Accept or reject an admin-suggested match',
  })
  @ApiResponse({
    status: 200,
    description: 'Match suggestion responded to successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Current user is not the recipient of this match suggestion.',
  })
  @ApiResponse({
    status: 404,
    description: 'Match suggestion not found.',
  })
  async respondToSuggestion(
    @Param('id') suggestionId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RespondMatchSuggestionDto,
  ) {
    return this.matchmakingService.respondToSuggestion(
      suggestionId,
      userId,
      dto.accepted,
    );
  }
}
