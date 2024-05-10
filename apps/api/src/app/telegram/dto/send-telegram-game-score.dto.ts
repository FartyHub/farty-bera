import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendTelegramGameScoreDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  inlineMessageId: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  chatId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  messageId: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  editMessage?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  force?: boolean;
}
