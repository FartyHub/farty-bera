import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user';
import { UserTask } from '../user-task/entities/user-task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  private readonly logger: Logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(UserTask)
    private userTaskRepository: Repository<UserTask>,
  ) {}

  create(createTaskDto: CreateTaskDto, user: User) {
    this.logger.log(`[CREATE_SCORE] ${JSON.stringify(createTaskDto, null, 2)}`);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.tasksRepository.save(createTaskDto);
  }

  async findAll(user?: User) {
    this.logger.log(`[FIND_ALL]`);

    const tasks = await this.tasksRepository.find({
      order: { createdAt: 'ASC' },
    });

    const promises = tasks.map(async (task) => {
      const userTask = await this.userTaskRepository
        .createQueryBuilder('userTask')
        .leftJoinAndSelect('userTask.user', 'user')
        .leftJoinAndSelect('userTask.task', 'task')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('task.id = :taskId', { taskId: task.id })
        .getOne();

      return {
        ...task,
        isDone: !!userTask,
      };
    });

    return Promise.all(promises);
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
