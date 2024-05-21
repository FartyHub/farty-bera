import { Module } from '@nestjs/common';

import { FartyBeraBotUpdate } from './farty-bera-bot.update';

@Module({
  providers: [FartyBeraBotUpdate],
})
export class FartyBeraBotModule {}
