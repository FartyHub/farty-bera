import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  getLeaderboard(@Query('date') date?: string) {
    return this.fartyClawService.getLeaderboard(date);
  }

  @Post('leaderboard/me')
  getMyLeaderboardPosition(
    @Body() { date, initData }: { date?: string; initData: string },
  ) {
    return this.fartyClawService.getMyLeaderboardPosition(initData, date);
  }

  @Post('user')
  saveUser(@Body() saveUserDto: SaveUserDto) {
    return this.fartyClawService.saveUser(saveUserDto);
  }
}
