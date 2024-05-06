import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'text', unique: true })
  @ApiProperty()
  @IsString()
  address: string;

  @Column({ nullable: true, type: 'text', unique: true })
  @ApiProperty()
  @IsString()
  @IsOptional()
  inviteCode?: string;

  @Column({ default: 5, type: 'int' })
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  inviteCodeLimit?: number;

  @Column({ nullable: true, type: 'text' })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  usedInviteCode?: string;

  @Column({ default: 0, type: 'int' })
  @ApiProperty()
  @IsNumber()
  fartyHighScore: number;

  @Column({ default: 0, type: 'int' })
  @ApiProperty()
  @IsNumber()
  fartyGamesPlayed: number;

  @Column({ default: 0, type: 'int' })
  @ApiProperty()
  @IsNumber()
  honeyScore: number;

  @Column({ default: 'Farty Bera', type: 'text' })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string;
}
