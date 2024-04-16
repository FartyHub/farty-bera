/* eslint-disable no-magic-numbers */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateRandomText } from '../../utils';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    this.logger.log(`[CREATE_USER] ${JSON.stringify(createUserDto, null, 2)}`);

    try {
      const user = this.usersRepository.create(createUserDto);
      const inviteCode = generateRandomText(6);

      user.inviteCode = inviteCode;

      return this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`[CREATE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    this.logger.log(`[GET_USERS]`);

    return this.usersRepository.find();
  }

  findOne(address: string) {
    this.logger.log(`[GET_USER] ${address}`);

    try {
      return this.usersRepository.findOneOrFail({ where: { address } });
    } catch (error) {
      this.logger.error(`[GET_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(address: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`[UPDATE_USER] ${address}`);

    try {
      const user = await this.findOne(address);
      const newUser = {
        ...user,
        ...updateUserDto,
      };

      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      this.logger.error(`[UPDATE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(address: string) {
    this.logger.log(`[DELETE_USER] ${address}`);

    try {
      await this.update(address, { deletedAt: new Date() });

      return true;
    } catch (error) {
      this.logger.error(`[DELETE_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
