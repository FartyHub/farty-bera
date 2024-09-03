import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from '../task/entities/task.entity';
import { User } from '../user';

import { UserTask } from './entities/user-task.entity';
import { UserTaskController } from './user-task.controller';
import { UserTaskService } from './user-task.service';

@Module({
  controllers: [UserTaskController],
  exports: [UserTaskService],
  imports: [TypeOrmModule.forFeature([UserTask, Task, User])],
  providers: [UserTaskService, ConfigService],
})
export class UserTaskModule {}
