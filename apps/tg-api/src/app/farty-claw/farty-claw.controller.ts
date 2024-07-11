import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiKey } from '../common';

import { SaveUserDto } from './dto';
import { FartyClawService } from './farty-claw.service';

@ApiTags('FartyClaw')
@Controller('farty-claw')
@ApiKey()
export class FartyClawController {
  constructor(private readonly fartyClawService: FartyClawService) {
    // no op
  }

  @Get('invoice/:amount')
  getInvoiceLink(@Param('amount') amount: string) {
    return this.fartyClawService.getInvoiceLink(+amount);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.fartyClawService.getLeaderboard();
  }

  @Post('leaderboard/me')
  getMyLeaderboardPosition(@Body('initData') initData: string) {
    return this.fartyClawService.getMyLeaderboardPosition(initData);
  }

  @Post('user')
  saveUser(@Body() saveUserDto: SaveUserDto) {
    return this.fartyClawService.saveUser(saveUserDto);
  }
}
