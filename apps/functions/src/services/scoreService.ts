/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScoresApi, BulkSoleCreateScoreDto } from '@farty-bera/api-lib';
import { AxiosError } from 'axios';

import ApiClient from '../api-client';

export const scoresApiClient = ApiClient.use(ScoresApi);

export async function createScore(data: BulkSoleCreateScoreDto) {
  try {
    const response = await scoresApiClient.scoreControllerCreateFartyClaw(data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
