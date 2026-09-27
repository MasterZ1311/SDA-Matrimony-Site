import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { PromptsService } from './prompts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PromptItemDto, UpdatePromptsDto } from './dto/update-prompts.dto';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';

@ApiTags('Faith Prompts & Reactions')
@Controller()
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('profile/prompts/available')
  @ApiOperation({ summary: 'List all curated faith prompts available for selection' })
  getAvailablePrompts() {
    return this.promptsService.getAvailablePrompts();
  }

  @Get('profile/prompts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user prompt answers with reaction counts' })
  async getMyPrompts(@CurrentUser('id') userId: string) {
    return this.promptsService.getMyPrompts(userId);
  }

  @Post('profile/prompts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert up to 3 faith prompt answers for current user' })
  @ApiResponse({ status: 200, description: 'Prompt answers updated successfully' })
  async updatePrompts(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    // Handle both raw array body [{ promptKey, answer }] and object body { prompts: [...] }
    const promptList: PromptItemDto[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.prompts)
      ? body.prompts
      : [];
    return this.promptsService.upsertPrompts(userId, promptList);
  }

  @Post('reactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like/unlike reaction on a candidate photo or prompt answer' })
  @ApiResponse({ status: 200, description: 'Reaction toggled successfully' })
  async toggleReaction(
    @CurrentUser('id') userId: string,
    @Body() dto: ToggleReactionDto,
  ) {
    return this.promptsService.toggleReaction(userId, dto);
  }
}
