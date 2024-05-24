import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { SendTelegramGameScoreDto } from './dto/send-telegram-game-score.dto';

@Injectable()
export class TelegramService {
  private readonly logger: Logger = new Logger(TelegramService.name);

  constructor(@InjectBot('fartyberabot') private fartyBot: Telegraf<Context>) {
    this.fartyBot.catch((error, ctx: Context) => {
      console.error('Telegraf error:', error);
      console.log(ctx);
    });
  }

  async sendGameScore(sendTelegramGameScoreDto: SendTelegramGameScoreDto) {
    this.logger.log(
      '[SEND_GAME_SCORE]',
      JSON.stringify(sendTelegramGameScoreDto, null, 2),
    );
    const {
      chatId,
      editMessage,
      force,
      inlineMessageId,
      messageId,
      score,
      userId,
    } = sendTelegramGameScoreDto;

    await this.fartyBot.telegram.setGameScore(
      userId,
      score,
      inlineMessageId,
      chatId,
      messageId,
      editMessage,
      force,
    );
  }
}
