import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common';

@Entity('farty-claw-users')
export class FartyClawUsers extends BaseEntity {
  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  username: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  firstName: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  lastName: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  address: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  telegramId: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  languageCode: string;

  @Column({ default: '', type: 'text' })
  @ApiProperty()
  @IsString()
  chatId: string;
}
