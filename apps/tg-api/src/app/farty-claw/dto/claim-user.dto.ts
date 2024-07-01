import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ClaimUserDto {
  @ApiProperty()
  @IsString()
  openid: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @Optional()
  username?: string;

  @ApiProperty()
  @IsNumber()
  gold: number;

  @ApiProperty()
  @IsString()
  head: string;
}
