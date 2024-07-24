import { Applications } from '@farty-bera/api-lib';
import * as functions from '@google-cloud/functions-framework';

import { createScore, getLeaderboard } from './services';

const MAX_RANK = 200;
const MAX_NOTS = 100000;

function calculateNOTs(gold: number, sum: number) {
  // eslint-disable-next-line no-magic-numbers
  return MAX_NOTS * (gold / sum);
}

export const updateFartyClawScore = functions.http(
  'updateFartyClawScore',
  async (req, res) => {
    const time = new Date().toISOString();
    const { list, sum } = await getLeaderboard();
    let result = 'saved';
    const soleCreateScoreDto = list.map((user) => ({
      game: Applications.Claw,
      rewards: Intl.NumberFormat('en', {
        maximumFractionDigits: 2,
        notation: 'compact',
      }).format(
        (user.rank ?? 0) > MAX_RANK ? 0 : calculateNOTs(user.gold ?? 0, sum),
      ),
      time,
      userAddress: user.id,
      value: user.gold,
    }));

    try {
      await createScore({
        soleCreateScoreDto,
      });
    } catch (error) {
      console.error('updateFartyClawScore', error);
      result = JSON.stringify(error);
    }

    res.send(result);
  },
);
