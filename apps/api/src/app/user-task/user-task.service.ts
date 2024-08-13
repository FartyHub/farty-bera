import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../task/entities/task.entity';
import { User } from '../user';

import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { GetUserTasksDto } from './dto/get-user-tasks.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';
import { UserTask } from './entities/user-task.entity';

@Injectable()
export class UserTaskService {
  private readonly logger: Logger = new Logger(UserTaskService.name);

  constructor(
    @InjectRepository(UserTask)
    private userTasksRepository: Repository<UserTask>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async validateUserTask(userId: string, userTaskId?: string) {
    this.logger.log(`[VALIDATE_USER_TASK] ${userTaskId} ${userId}`);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userTask = await this.userTasksRepository.findOne({
      where: { id: userTaskId },
    });

    if (userTaskId && !userTask) {
      throw new UnauthorizedException('User Task not found');
    }

    if (userTaskId && userTask?.user.id !== user.id) {
      throw new UnauthorizedException('User Task does not belong to user');
    }

    return {
      user,
      userTask,
    };
  }

  async create(createUserTaskDto: CreateUserTaskDto, reqUser: User) {
    this.logger.log(
      `[CREATE_SCORE] ${JSON.stringify(createUserTaskDto, null, 2)}`,
    );
    const { user } = await this.validateUserTask(reqUser.id);
    const task = await this.tasksRepository.findOne({
      where: { id: createUserTaskDto.taskId },
    });

    if (!task) {
      throw new UnauthorizedException('Task not found');
    }

    const userTask = this.userTasksRepository.create({
      task,
      user,
    });

    return this.userTasksRepository.save(userTask);
  }

  findAll(getUserTasks: GetUserTasksDto) {
    this.logger.log(`[FIND_ALL]`);

    const query = this.userTasksRepository.createQueryBuilder('userTask');

    query.leftJoinAndSelect('userTask.task', 'task');
    query.leftJoinAndSelect('userTask.user', 'user');

    if (getUserTasks?.userId) {
      query.andWhere('user.id = :userId', { userId: getUserTasks.userId });
    }

    return query.getMany();
  }

  findOne(id: string) {
    this.logger.log(`[FIND_ONE] ${id}`);

    return this.userTasksRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateUserTaskDto: UpdateUserTaskDto,
    reqUser: User,
  ) {
    this.logger.log(
      `[UPDATE] ${id}`,
      JSON.stringify(updateUserTaskDto, null, 2),
    );

    const { user, userTask } = await this.validateUserTask(reqUser.id, id);

    userTask.updatedAt = new Date();

    return this.userTasksRepository.save({
      ...userTask,
      ...updateUserTaskDto,
      user,
    });
  }

  async remove(id: string, user: User) {
    this.logger.log(`[REMOVE] ${id}`);

    return this.update(id, { deletedAt: new Date() }, user);
  }
}
