import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({
    generated: 'uuid',
    type: 'uuid',
  })
  @ApiProperty()
  @IsString()
  id: string;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
    type: 'timestamp',
  })
  @ApiProperty({ nullable: true })
  @IsDate()
  deletedAt?: Date;
}
