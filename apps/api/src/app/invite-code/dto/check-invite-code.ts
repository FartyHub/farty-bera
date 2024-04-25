import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckInviteCodeDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  inviteCode: string;
}
