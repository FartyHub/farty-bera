import { useQuery } from '@tanstack/react-query';

import {
  getLeaderboard,
  getMyLeaderboardPosition,
} from '../../services/tgApiService';

const LEADERBOARD_QUERY = 'LEADERBOARD';
const MY_LEADERBOARD_POSITION_QUERY = 'MY_LEADERBOARD_POSITION';

export function useGetLeaderboard() {
  return useQuery({
    queryFn: getLeaderboard,
    queryKey: [LEADERBOARD_QUERY],
  });
}

export function useGetMyLeaderboardPosition(initData: string) {
  return useQuery({
    queryFn: () => getMyLeaderboardPosition(initData),
    queryKey: [MY_LEADERBOARD_POSITION_QUERY, initData],
  });
}
