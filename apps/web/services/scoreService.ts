/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import {
  CreateScoreDto,
  Score,
  ScoresApi,
  UpdateScoreDto,
} from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const scoresApiClient = ApiClient.use(ScoresApi);

export async function getScores(address: string): Promise<Score[]> {
  try {
    const response = await scoresApiClient.scoreControllerFindAll(address);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function getScore(id: string): Promise<Score> {
  try {
    const response = await scoresApiClient.scoreControllerFindOne(id);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function createScore(data: CreateScoreDto): Promise<Score> {
  try {
    const response = await scoresApiClient.scoreControllerCreate(data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function updateScore(
  id: string,
  data: UpdateScoreDto,
): Promise<Score> {
  try {
    const response = await scoresApiClient.scoreControllerUpdate(id, data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function deleteScore(id: string): Promise<boolean> {
  try {
    const response = await scoresApiClient.scoreControllerRemove(id);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
