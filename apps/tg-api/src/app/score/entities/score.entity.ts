import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { Applications, BaseEntity } from '../../common';

@Entity('scores')
export class Score extends BaseEntity {
  @Column({ default: 0, type: 'int' })
  @ApiProperty()
  @IsNumber()
  value: number;

  @Column({ enum: Applications, type: 'enum' })
  @ApiProperty({
    enum: Applications,
    enumName: 'Applications',
  })
  @IsEnum(Applications)
  game: Applications;

  @Column({ type: 'text' })
  @ApiProperty()
  @IsString()
  userAddress: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  time: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  rewards: string;
}
