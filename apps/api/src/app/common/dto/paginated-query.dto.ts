import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

const LIMIT = 10;
const PAGE = 1;

export class PaginatedQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  readonly limit?: number = LIMIT;

  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  readonly page?: number = PAGE;
}
