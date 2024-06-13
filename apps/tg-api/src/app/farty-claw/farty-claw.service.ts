import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { InvoiceService } from '../invoice';

@Injectable()
export class FartyClawService {
  private readonly logger: Logger = new Logger(FartyClawService.name);

  constructor(
    @InjectBot() private fartyBot: Telegraf<Context>,
    @Inject(InvoiceService) private invoiceService: InvoiceService,
  ) {
    this.logger.log(
      'TelegramService initialized: ',
      this.fartyBot.telegram.token,
    );
    this.fartyBot.catch((error, ctx: Context) => {
      console.error('Telegraf error:', error);
      console.log(ctx);
    });
  }

  async getInvoiceLink() {
    this.logger.log('[GET_INVOICE_LINK]');

    const invoice = await this.invoiceService.create({
      currency: 'XTR',
      totalAmount: 15,
    });

    const url = await this.fartyBot.telegram.createInvoiceLink({
      currency: 'XTR',
      description: '1 Game of Farty Claw',
      payload: invoice.id,
      prices: [
        {
          amount: 15,
          label: '1 Game',
        },
      ],
      provider_token: '',
      title: '1 Farty Claw Game',
    });

    return { id: invoice.id, url };
  }
}
