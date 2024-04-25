import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common';

@Entity('project_invites')
export class ProjectInvite extends BaseEntity {
  @Column({ default: '', nullable: true, type: 'text' })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @Column({ type: 'text', unique: true })
  @ApiProperty()
  @IsString()
  inviteCode: string;

  @Column({ default: 1, type: 'int' })
  @ApiProperty()
  @IsNumber()
  inviteCodeLimit: number;
}
