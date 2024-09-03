import { PartialType } from '@nestjs/swagger';

import { ClaimPrizeDto } from './claim-prize.dto';

export class SaveUserDto extends PartialType(ClaimPrizeDto) {
  // no op
}
