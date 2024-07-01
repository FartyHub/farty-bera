/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Update,
  Ctx,
  Start,
  Help,
  On,
  Hears,
  GameQuery,
  InlineQuery,
  Command,
} from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';

import { Bot, ConfigKeys } from '../common';
import { RateLimitGuard } from '../common/guards/telegram.guard';
import { FartyClawUsers } from '../farty-claw-user';
import { InvoiceService } from '../invoice';

@Bot()
@SkipThrottle()
@Update()
@UseGuards(RateLimitGuard)
export class FartyBeraBotUpdate {
  private readonly logger: Logger = new Logger(FartyBeraBotUpdate.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly invoiceService: InvoiceService,
    @InjectRepository(FartyClawUsers)
    private fartyClawUsersRepository: Repository<FartyClawUsers>,
  ) {
    // no op
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    this.logger.log('[START]');

    this.saveUser(ctx);

    ctx.replyWithPhoto(
      {
        url: this.configService.get<string>(ConfigKeys.MainImageUUrl),
      },
      {
        caption: 'Catch a bera in the Farty Arcade and earn $NOTs.',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Play Farty Claw',
                web_app: {
                  url: this.configService.get<string>(ConfigKeys.WebUrl),
                },
              },
            ],
            [
              {
                text: 'Join Community',
                url: this.configService.get<string>(ConfigKeys.CommunityUrl),
              },
            ],
            [
              {
                text: 'Follow X',
                url: this.configService.get<string>(ConfigKeys.XUrl),
              },
            ],
          ],
        },
      },
    );
  }

  @Help()
  help(@Ctx() ctx: Context) {
    this.logger.log('[HELP]');

    this.saveUser(ctx);

    ctx.reply('Send start to play Farty Claw!');
  }

  @On('pre_checkout_query')
  async onPreCheckout(@Ctx() ctx: Context) {
    this.logger.log(
      '[PRE_CHECKOUT_QUERY]',
      JSON.stringify(ctx.preCheckoutQuery, null, 2),
    );

    try {
      const invoice = await this.invoiceService.findOne(
        ctx.preCheckoutQuery.invoice_payload,
      );
      await this.invoiceService.update(invoice.id, {
        firstName: ctx.preCheckoutQuery.from.first_name,
        lastName: ctx.preCheckoutQuery.from.last_name,
        preCheckoutQueryId: ctx.preCheckoutQuery.id,
      });

      ctx.answerPreCheckoutQuery(true);
    } catch (error) {
      this.logger.error(error);
      ctx.answerPreCheckoutQuery(false, 'Internal server error');
    }
  }

  @On('successful_payment')
  async onSuccessfulPayment(@Ctx() ctx: Context) {
    this.logger.log(
      '[SUCCESSFUL_PAYMENT]',
      JSON.stringify((ctx.update as any)?.message.successful_payment, null, 2),
    );

    const invoice = await this.invoiceService.findOne(
      (ctx.update as any)?.message.successful_payment.invoice_payload,
    );

    await this.invoiceService.update(invoice.id, {
      providerPaymentChargeId: (ctx.update as any)?.message.successful_payment
        .provider_payment_charge_id,
      telegramPaymentChargeId: (ctx.update as any)?.message.successful_payment
        .telegram_payment_charge_id,
    });
  }

  @Command('claim')
  async claim(@Ctx() ctx: Context) {
    this.logger.log('[CLAIM]');

    this.saveUser(ctx);

    ctx.reply('Claim your $NOTs now!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Claim $NOTs',
              web_app: {
                url: this.configService.get<string>(ConfigKeys.ClaimWebUrl),
              },
            },
          ],
        ],
      },
    });
  }

  // @Hears('hi')
  // async hears(@Ctx() ctx: Context) {
  //   await ctx.reply('Hey there');
  // }

  // @GameQuery()
  // gameQuery(@Ctx() ctx: Context) {
  //   const callbackQuery = (ctx.update as any).callback_query as Context;
  //   const urlQueries = {
  //     botId: ctx.botInfo?.id,
  //     chatId: callbackQuery.message?.chat?.id,
  //     editMessage: false,
  //     force: false,
  //     inlineMessageId: callbackQuery?.inlineMessageId,
  //     messageId: callbackQuery.message?.message_id,
  //     score: 0,
  //     userId: ctx.from.id,
  //   };
  //   this.logger.log('[GAME_QUERY]', JSON.stringify(ctx, null, 2));
  //   const botId = ctx.botInfo?.id;
  //   const webUrl = this.configService.get<string>(ConfigKeys.WebUrl);
  //   ctx.answerGameQuery(
  //     `${webUrl}/?botId=${botId}&userId=${urlQueries.userId}&chatId=${urlQueries.chatId}&messageId=${urlQueries.messageId}&inlineMessageId=${urlQueries.inlineMessageId}&score=0&editMessage=${urlQueries.editMessage}&force=${urlQueries.force}`,
  //   );
  // }

  // @InlineQuery([])
  // inlineQuery(@Ctx() ctx: Context) {
  //   ctx.answerInlineQuery([
  //     {
  //       game_short_name: 'Farty_Bera',
  //       id: '0',
  //       type: 'game',
  //     },
  //   ]);
  // }

  async saveUser(ctx: Context) {
    this.logger.log('[SAVE_USER]');

    try {
      const user = (ctx.update as any).message.from;

      const existingUser = await this.fartyClawUsersRepository.findOne({
        where: { telegramId: user.id },
      });

      if (existingUser) {
        await this.fartyClawUsersRepository.update(existingUser.id, {
          chatId: (ctx.update as any).message.chat.id,
        });
      } else {
        const newUser = this.fartyClawUsersRepository.create({
          chatId: (ctx.update as any).message.chat.id,
          firstName: user.first_name,
          languageCode: user.language_code,
          lastName: user.last_name,
          telegramId: user.id,
          username: user.username,
        });

        this.fartyClawUsersRepository.save(newUser);
      }
    } catch (error) {
      this.logger.error(`[SAVE_USER] ${error}`);
    }
  }
}
