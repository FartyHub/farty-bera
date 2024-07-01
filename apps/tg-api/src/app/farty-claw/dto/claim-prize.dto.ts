import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClaimPrizeDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  initData: string;
}
