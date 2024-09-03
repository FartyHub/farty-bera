import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OAuthResponseDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  oauth_token: string;

  @ApiProperty()
  @IsString()
  oauth_token_secret: string;

  @ApiProperty()
  @IsString()
  oauth_callback_confirmed: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  oauth_verifier?: string;
}
