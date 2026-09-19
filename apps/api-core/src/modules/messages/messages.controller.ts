import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'Chat message text content', example: 'Happy Sabbath! Looking forward to connecting.' })
  @IsString()
  @IsNotEmpty({ message: 'Message content is required.' })
  content: string;
}

@ApiTags('Matrimonial Conversations & Messaging')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List all active conversations for the authenticated member' })
  async getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Retrieve conversation history and messages' })
  async getConversationMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.messagesService.getConversationMessages(userId, conversationId);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message in an authorized conversation' })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, conversationId, dto.content);
  }

  @Get('icebreakers/:targetUserId')
  @ApiOperation({ summary: 'Generate faith-centered icebreakers and conversation starters for candidate' })
  async getIcebreakers(
    @CurrentUser('id') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.messagesService.getIcebreakers(userId, targetUserId);
  }
}

