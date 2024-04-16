import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.userService.findOne(address);
  }

  @Patch(':address')
  update(
    @Param('address') address: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(address, updateUserDto);
  }

  @Delete(':address')
  remove(@Param('address') address: string) {
    return this.userService.remove(address);
  }
}
