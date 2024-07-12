/* eslint-disable no-console */
import axios from 'axios';

const TG_API = `${import.meta.env.VITE_TG_API_URL}/api`;

const tgApiClient = axios.create({
  baseURL: TG_API,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_X_API_KEY,
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
    console.error(error);

    throw error;
  }
}

export async function getMyLeaderboardPosition(
  initData: string,
  sdate?: string,
  edate?: string,
) {
  try {
    const { data } = await tgApiClient.post(`/farty-claw/leaderboard/me`, {
      edate,
      initData,
      sdate,
    });
    console.log('data', data);

    return {
      ...data,
      id: data.openid,
    } as ClaimUserDto;
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function saveUser(address: string, initData: string) {
  try {
    const { data } = await tgApiClient.post('/farty-claw/user/', {
      address,
      initData,
    });

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
