import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';

export class PromptItemDto {
  @ApiProperty({
    description: 'Allowed identifier for the prompt question',
    example: 'SABBATH_TYPICAL',
  })
  @IsString()
  @IsNotEmpty()
  promptKey: string;

  @ApiProperty({
    description: 'Personal, reflective answer to the faith prompt',
    example: 'Visiting church shut-ins, taking a prayer walk in nature, or fellowship potluck.',
    maxLength: 600,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(600, { message: 'Answer cannot exceed 600 characters' })
  answer: string;
}

export class UpdatePromptsDto {
  @ApiProperty({
    description: 'Array of up to 3 prompt answers for the profile',
    type: [PromptItemDto],
    maxItems: 3,
  })
  @IsArray()
  @ArrayMaxSize(3, { message: 'A member profile may have at most 3 prompt answers' })
  @ValidateNested({ each: true })
  @Type(() => PromptItemDto)
  prompts: PromptItemDto[];
}
