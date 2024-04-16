import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsDate()
  deletedAt: Date;
}
