import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ToggleReactionDto {
  @ApiPropertyOptional({
    description: 'Target photo ID to react to (mutually exclusive with promptAnswerId)',
    example: 'd8c47b56-3f12-4c67-a2f4-8178345719bc',
  })
  @IsOptional()
  @IsString()
  photoId?: string;

  @ApiPropertyOptional({
    description: 'Target prompt answer ID to react to (mutually exclusive with photoId)',
    example: 'a4b22c77-1d54-4f89-b5f7-9261829370ad',
  })
  @IsOptional()
  @IsString()
  promptAnswerId?: string;
}
