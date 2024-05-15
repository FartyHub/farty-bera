import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateScoreDto } from './dto/create-score.dto';
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
}
