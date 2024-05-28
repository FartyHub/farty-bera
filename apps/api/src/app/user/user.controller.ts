import { Controller, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Public, SignDto } from '../common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @Public()
  async loginUser(@Body() signDto: SignDto, @Res() response: Response) {
    return this.userService.loginWithSignature(signDto, response);
  }

  @Post()
  @ApiOkResponse({ type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: [User] })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('invited-count')
  @ApiOkResponse({ type: Number })
  findAllInvitedCount(): Promise<number> {
    return this.userService.findAllInvitedCount();
  }

  @Get('invite-code:address')
  @ApiOkResponse({ type: String })
  generateInviteCode(@Param('address') address: string): Promise<string> {
    return this.userService.generateInviteCode(address);
  }

  @Get('user-rank/:address')
  @ApiOkResponse({ type: Number })
  getUserRank(@Param('address') address: string): Promise<number> {
    return this.userService.getUserRank(address);
  }

  @Get('top-ranks')
  @Public()
  @ApiOkResponse({ type: [User] })
  getTopRanks(): Promise<User[]> {
    return this.userService.getTopRanks();
  }

  @Get(':address')
  @ApiOkResponse({ type: User })
  findOne(@Param('address') address: string): Promise<User> {
    return this.userService.findOne(address);
  }

  @Patch(':address')
  @ApiOkResponse({ type: User })
  update(
    @Param('address') address: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(address, updateUserDto);
  }
}
