import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedRequest } from '../../types';

import { CreateScoreDto } from './dto/create-score.dto';
import { Score } from './entities/score.entity';
import { ScoreService } from './score.service';

@ApiTags('Scores')
@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @ApiOkResponse({ type: Score })
  create(
    @Body() createScoreDto: CreateScoreDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Score> {
    const { key, message, signature, ...rest } = createScoreDto;

    return this.scoreService.create(rest, req.user, {
      key,
      message,
      signature,
    });
  }
}
