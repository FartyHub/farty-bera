import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  controllers: [TwitterController],
  providers: [ConfigService, TwitterService],
})
export class TwitterModule {
  // no op
}
