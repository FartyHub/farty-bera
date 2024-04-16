import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto {
  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly count: number;
}
