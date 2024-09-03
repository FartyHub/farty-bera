import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedRequest } from '../../types';

import { Task } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOkResponse({ isArray: true, type: Task })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.taskService.findAll(req.user);
  }

  @Get(':id')
  @ApiOkResponse({ type: Task })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }
}
