import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserTasksDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}
