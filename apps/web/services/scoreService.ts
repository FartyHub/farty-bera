/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import { CreateScoreDto, Score, ScoresApi } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const scoresApiClient = ApiClient.use(ScoresApi);

export async function createScore(data: CreateScoreDto): Promise<Score> {
  try {
    const response = await scoresApiClient.scoreControllerCreate(data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
