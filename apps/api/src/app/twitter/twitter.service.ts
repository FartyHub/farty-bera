import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';

import { ConfigKeys } from '../common';

import { OAuthResponseDto } from './dto/oauth-response.dto';

@Injectable()
export class TwitterService {
  private readonly logger: Logger = new Logger(TwitterService.name);

  private readonly twitterClient: TwitterApi;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    const client = new TwitterApi({
      appKey: this.configService.get<string>(ConfigKeys.TwitterKey),
      appSecret: this.configService.get<string>(ConfigKeys.TwitterSecret),
    });

    this.twitterClient = client;
  }

  async getOAuthLink(): Promise<OAuthResponseDto> {
    this.logger.log('[GET_OAUTH_LINK]');

    return this.twitterClient.generateAuthLink(
      this.configService.get<string>(ConfigKeys.WebUrl),
    );
  }
}
