/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-params */
/* eslint-disable no-console */
import { createHmac } from 'crypto';

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Repository } from 'typeorm';

import { ConfigKeys } from '../common';
import { FartyClawUsers } from '../farty-claw-user';
import { InvoiceService } from '../invoice';

import { ClaimUserDto, SaveUserDto } from './dto';

@Injectable()
export class FartyClawService {
  private readonly logger: Logger = new Logger(FartyClawService.name);

  private readonly fartyClawGameApi: AxiosInstance;

  constructor(
    @InjectBot() private fartyBot: Telegraf<Context>,
    @Inject(InvoiceService) private invoiceService: InvoiceService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(FartyClawUsers)
    private fartyClawUsersRepository: Repository<FartyClawUsers>,
  ) {
    this.logger.log(
      'TelegramService initialized: ',
      this.fartyBot.telegram.token,
    );
    this.fartyBot.catch((error, ctx: Context) => {
      console.error('Telegraf error:', error);
      console.log(ctx);
    });
    this.fartyClawGameApi = axios.create({
      baseURL: this.configService.get<string>(ConfigKeys.FartyClawApiUrl),
    });
  }

  async getInvoiceLink(amount: number) {
    this.logger.log('[GET_INVOICE_LINK]');

    const invoice = await this.invoiceService.create({
      currency: 'XTR',
      totalAmount: amount,
    });

    const url = await this.fartyBot.telegram.createInvoiceLink({
      currency: 'XTR',
      description: '1 Game of Farty Claw',
      payload: invoice.id,
      prices: [
        {
          amount: amount,
          label: '1 Game',
        },
      ],
      provider_token: '',
      title: '1 Farty Claw Game',
    });

    return { id: invoice.id, url };
  }

  async saveUser(saveUserDto: SaveUserDto) {
    this.logger.log('[SAVE_USER]', JSON.stringify(saveUserDto, null, 2));
    const { address, initData } = saveUserDto;
    const { isVerified, user } = await this.verifyUser(initData);

    if (!isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    let existingUser = await this.fartyClawUsersRepository.findOne({
      where: { telegramId: user.id },
    });

    if (!existingUser) {
      existingUser = await this.fartyClawUsersRepository.save({
        address,
        firstName: user.first_name,
        languageCode: user.language_code,
        lastName: user.last_name,
        telegramId: user.id,
      });
    } else if (address && !existingUser.address) {
      existingUser = await this.fartyClawUsersRepository.save({
        ...existingUser,
        address,
      });
    }

    return existingUser;
  }

  async getLeaderboard(sdate?: string, edate?: string) {
    this.logger.log('[GET_LEADERBOARD]', sdate, edate);

    const { data } = await this.fartyClawGameApi.get(
      `/getTGBand` +
        (sdate ? `?sdate=${sdate}` : '') +
        (edate ? `&edate=${edate}` : ''),
    );
    const list: ClaimUserDto[] = Array.from(data?.info?.list) || [];
    const sum = data?.info?.SumGold2 || 0;

    return { list, sum };
  }

  async getMyLeaderboardPosition(
    initData: string,
    sdate?: string,
    edate?: string,
  ) {
    this.logger.log('[GET_USER_RANKING]', initData, sdate, edate);
    const { isVerified, user } = await this.verifyUser(initData);

    if (!isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    const { data } = await this.fartyClawGameApi.get(
      `/getTGBand?tgid=${user.id}` +
        (sdate ? `&sdate=${sdate}` : '') +
        (edate ? `&edate=${edate}` : ''),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { list, ...rest } = data?.info || {};

    return rest;
  }

  async verifyUser(initData: string) {
    this.logger.log('[VERIFY_USER]', initData);

    const q = new URLSearchParams(initData);
    const hash = q.get('hash');
    const user = JSON.parse(q.get('user'));
    q.delete('hash');

    const v = Array.from(q.entries());
    v.sort(([aN], [bN]) => aN.localeCompare(bN));

    const dataCheckString = v.map(([n, m]) => `${n}=${m}`).join('\n');

    const botToken = this.configService.get<string>(ConfigKeys.TelegramApiKey);
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const key = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return { isVerified: key === hash, user };
  }
}
