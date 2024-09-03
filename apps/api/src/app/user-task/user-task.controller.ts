import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedRequest } from '../../types';

import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { GetUserTasksDto } from './dto/get-user-tasks.dto';
import { UserTask } from './entities/user-task.entity';
import { UserTaskService } from './user-task.service';

@ApiTags('UserTasks')
@Controller('user-tasks')
export class UserTaskController {
  constructor(private readonly userTaskService: UserTaskService) {}

  @Post()
  @ApiOkResponse({ type: UserTask })
  create(
    @Body() createUserTaskDto: CreateUserTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.userTaskService.create(createUserTaskDto, req.user);
  }

  @Get()
  @ApiOkResponse({ isArray: true, type: UserTask })
  findAll(@Query() getUserTasksDto: GetUserTasksDto) {
    return this.userTaskService.findAll(getUserTasksDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserTask })
  findOne(@Param('id') id: string) {
    return this.userTaskService.findOne(id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserTask })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.userTaskService.remove(id, req.user);
  }
}
