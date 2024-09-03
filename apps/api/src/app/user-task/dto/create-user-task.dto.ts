import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateUserTaskDto {
  @ApiProperty()
  @IsString()
  taskId: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  oauth_token?: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  oauth_verifier?: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  oauth_token_secret?: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  discordToken?: string | null;
}
