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
  getLeaderboard(
    @Query('sdate') sdate?: string,
    @Query('edate') edate?: string,
  ) {
    return this.fartyClawService.getLeaderboard(sdate, edate);
  }

  @Post('leaderboard/me')
  getMyLeaderboardPosition(
    @Body()
    {
      edate,
      initData,
      sdate,
      tgId,
    }: {
      edate?: string;
      initData: string;
      sdate?: string;
      tgId: string;
    },
  ) {
    return this.fartyClawService.getMyLeaderboardPosition(
      initData,
      tgId,
      sdate,
      edate,
    );
  }

  @Post('user')
  saveUser(@Body() saveUserDto: SaveUserDto) {
    return this.fartyClawService.saveUser(saveUserDto);
  }
}
