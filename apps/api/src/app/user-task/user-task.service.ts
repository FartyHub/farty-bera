/* eslint-disable no-constant-condition */
/* eslint-disable max-params */
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { TwitterApi } from 'twitter-api-v2';
import { Repository } from 'typeorm';

import { ConfigKeys } from '../common';
import { Task } from '../task/entities/task.entity';
import { User } from '../user';

import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { GetUserTasksDto } from './dto/get-user-tasks.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';
import { UserTask } from './entities/user-task.entity';

@Injectable()
export class UserTaskService {
  private readonly logger: Logger = new Logger(UserTaskService.name);

  private readonly discordClient: AxiosInstance;

  constructor(
    @InjectRepository(UserTask)
    private userTasksRepository: Repository<UserTask>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.discordClient = axios.create({
      baseURL: this.configService.get<string>(ConfigKeys.DiscordApiUrl),
    });
  }

  async validateUserTask(userId: string, userTaskId?: string, taskId?: string) {
    this.logger.log(`[VALIDATE_USER_TASK] ${userTaskId} ${userId} ${taskId}`);
    let userTask: UserTask | undefined;
    let task: Task | undefined;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (userTaskId) {
      userTask = await this.userTasksRepository.findOne({
        where: { id: userTaskId },
      });

      if (!userTask) {
        throw new UnauthorizedException('User Task not found');
      }

      if (userTask?.user.id !== user.id) {
        throw new UnauthorizedException('User Task does not belong to user');
      }
    }

    if (taskId) {
      task = await this.tasksRepository.findOne({
        where: { id: taskId },
      });

      if (!task) {
        throw new UnauthorizedException('Task not found');
      }

      userTask = await this.userTasksRepository
        .createQueryBuilder('userTask')
        .leftJoinAndSelect('userTask.task', 'task')
        .leftJoinAndSelect('userTask.user', 'user')
        .where('task.id = :taskId', { taskId })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      if (userTask) {
        throw new UnauthorizedException('User Task already exists');
      }
    }

    return {
      task,
      user,
      userTask,
    };
  }

  async create(createUserTaskDto: CreateUserTaskDto, reqUser: User) {
    this.logger.log(
      `[CREATE_USER_TASK] ${JSON.stringify(createUserTaskDto, null, 2)}`,
    );
    const { task, user } = await this.validateUserTask(
      reqUser.id,
      undefined,
      createUserTaskDto.taskId,
    );

    if (
      task.title === 'Follow @fartybera' &&
      createUserTaskDto.oauth_verifier
    ) {
      const twitterClient = new TwitterApi({
        accessSecret: createUserTaskDto.oauth_token_secret,
        accessToken: createUserTaskDto.oauth_token,
        appKey: this.configService.get<string>(ConfigKeys.TwitterKey),
        appSecret: this.configService.get<string>(ConfigKeys.TwitterSecret),
      });

      const { client: loggedInClient } = await twitterClient.login(
        createUserTaskDto.oauth_verifier,
      );

      const result = await loggedInClient.v2.get(
        'users/by/username/fartybera',
        {
          'user.fields': ['connection_status', 'created_at'],
        },
      );

      if (
        !((result.data?.connection_status as string[]) ?? []).includes(
          'following',
        )
      ) {
        throw new UnauthorizedException('User is not following @fartybera');
      } else {
        this.usersRepository.update(user.id, {
          twitterId: result.data.id,
        });
      }
    } else if (task.title === 'Follow @fartybera') {
      throw new UnauthorizedException('User is not following @fartybera');
    } else if (
      task.title === 'Early Farty Certified' &&
      new Date(user.createdAt) > new Date('2024-06-01')
    ) {
      throw new UnauthorizedException('User is not early');
    } else if (
      task.title === 'Join Discord Channel' &&
      createUserTaskDto.discordToken
    ) {
      const response = await this.discordClient.get(
        `/users/@me/guilds/${this.configService.get<string>(ConfigKeys.DiscordServerId)}/member`,
        {
          headers: {
            Authorization: createUserTaskDto.discordToken,
          },
        },
      );

      if (!response.data?.joined_at) {
        throw new UnauthorizedException('User is not in Discord');
      } else {
        this.usersRepository.update(user.id, {
          discordId: response.data?.user.id,
        });
      }
    } else if (task.title === 'Join Discord Channel') {
      throw new UnauthorizedException('User is not in Discord');
    }

    const userTask = this.userTasksRepository.create({
      task,
      user,
      value: task.value,
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
