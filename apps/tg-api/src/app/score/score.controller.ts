import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiKey } from '../common';

import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';

@ApiTags('Scores')
@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':userAddress')
  @ApiOkResponse({ type: Score })
  @ApiKey()
  getScore(@Param('userAddress') userAddress: string): Promise<Score> {
    return this.scoreService.findOne(userAddress);
  }
}
