import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  private readonly logger: Logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, user: User) {
    this.logger.log(`[CREATE_SCORE] ${JSON.stringify(createTaskDto, null, 2)}`);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.tasksRepository.save(createTaskDto);
  }

  findAll() {
    this.logger.log(`[FIND_ALL]`);

    return this.tasksRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  findOne(id: string) {
    this.logger.log(`[FIND_ONE] ${id}`);

    return this.tasksRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    this.logger.log(`[UPDATE] ${id}`, JSON.stringify(updateTaskDto, null, 2));

    return this.tasksRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    this.logger.log(`[REMOVE] ${id}`);

    return this.tasksRepository.delete(id);
  }
}
