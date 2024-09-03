import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../user';

@Entity('user-tasks')
export class UserTask extends BaseEntity {
  @Column({ type: 'int' })
  @ApiProperty()
  @IsNumber()
  value: number;

  @ManyToOne(() => User, (user) => user.usedTasks, {
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Task, (task) => task.userTasks, {
    nullable: true,
  })
  @JoinColumn()
  task: Task;
}
