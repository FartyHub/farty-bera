import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @Optional()
  usedInviteCode?: string;
}
