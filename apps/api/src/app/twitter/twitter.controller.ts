import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../common';

import { OAuthResponseDto } from './dto/oauth-response.dto';
import { TwitterService } from './twitter.service';

@ApiTags('Twitter')
@Controller('twitter')
@Public()
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {
    // no op
  }

  @Get('oauth-link')
  @ApiOkResponse({ type: OAuthResponseDto })
  getOAuthLink(): Promise<OAuthResponseDto> {
    return this.twitterService.getOAuthLink();
  }
}
