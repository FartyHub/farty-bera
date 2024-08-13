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
}
