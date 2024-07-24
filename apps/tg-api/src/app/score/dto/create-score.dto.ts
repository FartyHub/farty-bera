import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

import { Applications, SignDto } from '../../common';

export class CreateScoreDto extends SignDto implements SoleCreateScoreDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty({
    enum: Applications,
    enumName: 'Applications',
  })
  @IsEnum(Applications)
  game: Applications;

  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsString()
  hash: string;
}

export class SoleCreateScoreDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty({
    enum: Applications,
    enumName: 'Applications',
  })
  @IsEnum(Applications)
  game: Applications;

  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  hash?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rewards?: string;
}

export class BulkSoleCreateScoreDto {
  @ApiProperty({
    type: [SoleCreateScoreDto],
  })
  @IsArray()
  @IsOptional()
  soleCreateScoreDto: SoleCreateScoreDto[];
}
