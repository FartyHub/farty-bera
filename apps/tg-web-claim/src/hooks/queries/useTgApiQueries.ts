import { useQuery } from '@tanstack/react-query';

import {
  getLeaderboard,
  getMyLeaderboardPosition,
} from '../../services/tgApiService';

const LEADERBOARD_QUERY = 'LEADERBOARD';
const MY_LEADERBOARD_POSITION_QUERY = 'MY_LEADERBOARD_POSITION';

export function useGetLeaderboard(date?: string) {
  return useQuery({
    queryFn: () => getLeaderboard(date),
    queryKey: [LEADERBOARD_QUERY, date],
  });
}

export function useGetMyLeaderboardPosition(initData: string, date?: string) {
  return useQuery({
    queryFn: () => getMyLeaderboardPosition(initData, date),
    queryKey: [MY_LEADERBOARD_POSITION_QUERY, initData, date],
  });
}
