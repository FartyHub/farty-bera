import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../user';

@Entity('user-tasks')
export class UserTask extends BaseEntity {
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
