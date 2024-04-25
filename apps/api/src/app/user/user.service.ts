/* eslint-disable no-magic-numbers */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { calculateHoneyScore, generateRandomText } from '../../utils';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  async findOne(address: string) {
    this.logger.log(`[GET_USER] ${address}`);

    try {
      return await this.usersRepository.findOneOrFail({ where: { address } });
    } catch (error) {
      this.logger.error(`[GET_USER] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(address: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`[UPDATE_USER] ${address}`);

    try {
      const user = await this.findOne(address);
      const newUser = this.usersRepository.create({
        ...user,
        ...updateUserDto,
      });

      newUser.honeyScore = calculateHoneyScore(
        newUser.fartyGamesPlayed,
        newUser.fartyHighScore,
      );

      if (newUser.honeyScore >= 100) {
        newUser.inviteCode = generateRandomText(6);
      }

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

  async generateInviteCode(address: string) {
    this.logger.log(`[GENERATE_INVITE_CODE] ${address}`);

    try {
      const user = await this.findOne(address);
      const inviteCode = generateRandomText(6);

      user.inviteCode = inviteCode;

      await this.usersRepository.save(user);

      return inviteCode;
    } catch (error) {
      this.logger.error(`[GENERATE_INVITE_CODE] ${error.message}`);

      throw new InternalServerErrorException(error.message);
    }
  }
}
