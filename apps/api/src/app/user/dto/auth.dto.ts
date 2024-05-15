import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginWithSignature {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsString()
  message: string;
}
