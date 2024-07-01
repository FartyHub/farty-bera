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
  username?: string;
};

export async function getLeaderboard() {
  try {
    const { data } = await tgApiClient.get('/farty-claw/leaderboard');

    return Array.from(data as ClaimUserDto[]).map((rank) => ({
      ...rank,
      id: rank.openid,
    }));
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export async function getMyLeaderboardPosition(initData: string) {
  try {
    const { data } = await tgApiClient.get(
      `/farty-claw/leaderboard/me?initData=${initData}`,
    );

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

export async function claimPrize(address: string, initData: string) {
  try {
    const { data } = await tgApiClient.post('/farty-claw/claim-prize/', {
      address,
      initData,
    });

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
