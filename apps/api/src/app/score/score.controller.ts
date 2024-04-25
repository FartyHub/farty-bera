import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';

@ApiTags('Scores')
@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @ApiOkResponse({ type: Score })
  create(@Body() createScoreDto: CreateScoreDto): Promise<Score> {
    return this.scoreService.create(createScoreDto);
  }

  @Get(':address')
  @ApiOkResponse({ type: [Score] })
  findAll(@Param('address') address: string): Promise<Score[]> {
    return this.scoreService.findAll(address);
  }

  @Get(':id')
  @ApiOkResponse({ type: Score })
  findOne(@Param('id') id: string): Promise<Score> {
    return this.scoreService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Score })
  update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoreService.update(id, updateScoreDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  remove(@Param('id') id: string) {
    return this.scoreService.remove(id);
  }
}
