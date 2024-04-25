import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { Applications } from '../../common';

export class CreateScoreDto {
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
}
