import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptItemDto } from './dto/update-prompts.dto';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import {
  ALLOWED_PROMPT_KEYS,
  FAITH_PROMPT_MAP,
  FAITH_PROMPTS,
} from './prompts.constants';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns list of all predefined faith prompts available for selection.
   */
  getAvailablePrompts() {
    return FAITH_PROMPTS;
  }

  /**
   * Upserts the authenticated user's faith prompt answers (up to 3).
   */
  async upsertPrompts(userId: string, prompts: PromptItemDto[]) {
    if (prompts.length > 3) {
      throw new BadRequestException('A member profile may have at most 3 prompt answers.');
    }

    const profile = await (this.prisma as any).profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Member profile not found.');
    }

    // Validate prompt keys against curated allowed list
    for (const item of prompts) {
      if (!ALLOWED_PROMPT_KEYS.includes(item.promptKey)) {
        throw new BadRequestException(
          `Prompt key "${item.promptKey}" is not a recognized faith prompt.`,
        );
      }
    }

    // Check for duplicate keys in payload
    const keys = prompts.map((p) => p.promptKey);
    if (new Set(keys).size !== keys.length) {
      throw new BadRequestException('Duplicate prompt questions are not allowed.');
    }

    // Use transaction to replace existing prompt answers with new ordered list
    return (this.prisma as any).$transaction(async (tx: any) => {
      await tx.promptAnswer.deleteMany({
        where: { profileId: profile.id },
      });

      if (prompts.length === 0) {
        return [];
      }

      const createdList: any[] = [];
      for (let i = 0; i < prompts.length; i++) {
        const item = prompts[i];
        const record = await tx.promptAnswer.create({
          data: {
            profileId: profile.id,
            promptKey: item.promptKey,
            answer: item.answer.trim(),
            order: i,
          },
        });
        const meta = FAITH_PROMPT_MAP[item.promptKey] || {
          category: 'FAITH & LIFE',
          question: item.promptKey,
        };
        createdList.push({
          ...record,
          category: meta.category,
          question: meta.question,
          reactionCount: 0,
          reactedByMe: false,
        });
      }

      return createdList;
    });
  }

  /**
   * Retrieves the authenticated user's current prompt answers.
   */
  async getMyPrompts(userId: string) {
    const profile = await (this.prisma as any).profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Member profile not found.');
    }

    const answers = await (this.prisma as any).promptAnswer.findMany({
      where: { profileId: profile.id },
      orderBy: { order: 'asc' },
      include: {
        reactions: {
          select: { userId: true },
        },
      },
    });

    return answers.map((ans: any) => {
      const meta = FAITH_PROMPT_MAP[ans.promptKey] || {
        category: 'FAITH & LIFE',
        question: ans.promptKey,
      };
      const reactions = ans.reactions || [];
      return {
        id: ans.id,
        profileId: ans.profileId,
        promptKey: ans.promptKey,
        category: meta.category,
        question: meta.question,
        answer: ans.answer,
        order: ans.order,
        reactionCount: reactions.length,
        reactedByMe: reactions.some((r: any) => r.userId === userId),
        createdAt: ans.createdAt,
        updatedAt: ans.updatedAt,
      };
    });
  }

  /**
   * Toggles a reaction (like/unlike) on either a Photo or a PromptAnswer.
   */
  async toggleReaction(userId: string, dto: ToggleReactionDto) {
    const hasPhoto = Boolean(dto.photoId);
    const hasPrompt = Boolean(dto.promptAnswerId);

    if ((!hasPhoto && !hasPrompt) || (hasPhoto && hasPrompt)) {
      throw new BadRequestException(
        'Exactly one of photoId or promptAnswerId must be provided.',
      );
    }

    if (hasPhoto) {
      const photo = await (this.prisma as any).photo.findUnique({
        where: { id: dto.photoId },
      });
      if (!photo) {
        throw new NotFoundException('Photo not found.');
      }

      const existingReaction = await (this.prisma as any).reaction.findUnique({
        where: {
          userId_photoId: {
            userId,
            photoId: dto.photoId!,
          },
        },
      });

      let liked = false;
      if (existingReaction) {
        await (this.prisma as any).reaction.delete({
          where: { id: existingReaction.id },
        });
        liked = false;
      } else {
        await (this.prisma as any).reaction.create({
          data: {
            userId,
            photoId: dto.photoId!,
          },
        });
        liked = true;
      }

      const reactionCount = await (this.prisma as any).reaction.count({
        where: { photoId: dto.photoId! },
      });

      return {
        liked,
        reactionCount,
        photoId: dto.photoId,
      };
    }

    // Has Prompt Answer
    const promptAnswer = await (this.prisma as any).promptAnswer.findUnique({
      where: { id: dto.promptAnswerId },
    });
    if (!promptAnswer) {
      throw new NotFoundException('Prompt answer not found.');
    }

    const existingReaction = await (this.prisma as any).reaction.findUnique({
      where: {
        userId_promptAnswerId: {
          userId,
          promptAnswerId: dto.promptAnswerId!,
        },
      },
    });

    let liked = false;
    if (existingReaction) {
      await (this.prisma as any).reaction.delete({
        where: { id: existingReaction.id },
      });
      liked = false;
    } else {
      await (this.prisma as any).reaction.create({
        data: {
          userId,
          promptAnswerId: dto.promptAnswerId!,
        },
      });
      liked = true;
    }

    const reactionCount = await (this.prisma as any).reaction.count({
      where: { promptAnswerId: dto.promptAnswerId! },
    });

    return {
      liked,
      reactionCount,
      promptAnswerId: dto.promptAnswerId,
    };
  }
}
