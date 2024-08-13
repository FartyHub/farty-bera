import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common';
import { UserTask } from '../../user-task/entities/user-task.entity';

export enum TaskType {
  CUSTOM = 'custom',
  DAILY = 'daily',
  EARLY = 'early',
  SOCIAL = 'social',
}

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ type: 'text' })
  @ApiProperty()
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @ApiProperty()
  @IsString()
  description: string;

  @Column({ enum: TaskType })
  @ApiProperty()
  @IsEnum(TaskType)
  type: TaskType;

  @Column({ type: 'int' })
  @ApiProperty()
  @IsNumber()
  value: number;

  @OneToMany(() => UserTask, (userTask) => userTask.task, {
    nullable: true,
  })
  userTasks?: UserTask[];
}
