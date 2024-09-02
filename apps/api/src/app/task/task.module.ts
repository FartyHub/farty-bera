import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTask } from '../user-task/entities/user-task.entity';

import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  exports: [TaskService],
  imports: [TypeOrmModule.forFeature([Task, UserTask])],
  providers: [TaskService],
})
export class TaskModule {}
