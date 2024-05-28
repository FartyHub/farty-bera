import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendTelegramGameScoreDto } from './dto/send-telegram-game-score.dto';
import { TelegramService } from './telegram.service';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {
    // no op
  }

  @Post('send-game-score')
  sendGameScore(@Body() sendTelegramGameScoreDto: SendTelegramGameScoreDto) {
    return this.telegramService.sendGameScore(sendTelegramGameScoreDto);
  }
}
