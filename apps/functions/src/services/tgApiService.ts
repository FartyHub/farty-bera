/* eslint-disable no-console */
import { Score } from '@farty-bera/api-lib';
import axios from 'axios';

import { TG_API_URL, TG_X_API_KEY } from '../constants';

const TG_API = `${TG_API_URL}/api`;

const tgApiClient = axios.create({
  baseURL: TG_API,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': TG_X_API_KEY,
  },
});

export type ClaimUserDto = {
  gold: number;
  head: string;
  id: string;
  nickname: string;
  openid: string;
  rank?: number;
  username?: string;
};

export async function getLeaderboard(
  sdate?: string,
  edate?: string,
): Promise<{
  list: ClaimUserDto[];
  sum: number;
}> {
  try {
    const { data } = await tgApiClient.get(`/farty-claw/leaderboard`, {
      params: {
        edate,
        sdate,
      },
    });

    return {
      list: Array.from(data.list as ClaimUserDto[]).map((rank) => ({
        ...rank,
        id: rank.openid,
      })),
      sum: data.sum,
    };
  } catch (error) {
    console.error('getLeaderboard', error);

    throw error;
  }
}

export async function getScore(userAddress: string): Promise<Score> {
  try {
    const { data } = await tgApiClient.get(`/scores`, {
      params: {
        userAddress,
      },
    });

    return data;
  } catch (error) {
    console.error('getScore', error);

    throw error;
  }
}
