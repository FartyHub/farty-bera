/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import {
  Update,
  Ctx,
  Start,
  Help,
  On,
  Hears,
  GameQuery,
  InlineQuery,
} from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { Bot, ConfigKeys } from '../common';
import { RateLimitGuard } from '../common/guards/telegram.guard';

@Bot()
@SkipThrottle()
@Update()
@UseGuards(RateLimitGuard)
export class FartyBeraBotUpdate {
  private readonly logger: Logger = new Logger(FartyBeraBotUpdate.name);

  constructor(private readonly configService: ConfigService) {}

  @Start()
  start(@Ctx() ctx: Context) {
    this.logger.log('[START]');
    ctx.sendGame('Farty_Bera');
  }

  @Help()
  help(@Ctx() ctx: Context) {
    this.logger.log('[HELP]');
    ctx.reply('Send me start to play a game!');
  }

  // @On('sticker')
  // async on(@Ctx() ctx: Context) {
  //   await ctx.reply('👍');
  // }

  // @Hears('hi')
  // async hears(@Ctx() ctx: Context) {
  //   await ctx.reply('Hey there');
  // }

  @GameQuery()
  gameQuery(@Ctx() ctx: Context) {
    const callbackQuery = (ctx.update as any).callback_query as Context;
    const urlQueries = {
      botId: ctx.botInfo?.id,
      chatId: callbackQuery.message?.chat?.id,
      editMessage: false,
      force: false,
      inlineMessageId: callbackQuery?.inlineMessageId,
      messageId: callbackQuery.message?.message_id,
      score: 0,
      userId: ctx.from.id,
    };
    this.logger.log('[GAME_QUERY]', JSON.stringify(ctx, null, 2));
    const botId = ctx.botInfo?.id;
    const webUrl = this.configService.get<string>(ConfigKeys.WebUrl);
    ctx.answerGameQuery(
      `${webUrl}/?botId=${botId}&userId=${urlQueries.userId}&chatId=${urlQueries.chatId}&messageId=${urlQueries.messageId}&inlineMessageId=${urlQueries.inlineMessageId}&score=0&editMessage=${urlQueries.editMessage}&force=${urlQueries.force}`,
    );
  }

  @InlineQuery([])
  inlineQuery(@Ctx() ctx: Context) {
    ctx.answerInlineQuery([
      {
        game_short_name: 'Farty_Bera',
        id: '0',
        type: 'game',
      },
    ]);
  }
}
