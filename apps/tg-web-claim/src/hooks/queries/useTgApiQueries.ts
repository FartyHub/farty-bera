import { useQuery } from '@tanstack/react-query';

import {
  getLeaderboard,
  getMyLeaderboardPosition,
} from '../../services/tgApiService';

const LEADERBOARD_QUERY = 'LEADERBOARD';
const MY_LEADERBOARD_POSITION_QUERY = 'MY_LEADERBOARD_POSITION';

export function useGetLeaderboard(sdate?: string, edate?: string) {
  return useQuery({
    queryFn: () => getLeaderboard(sdate, edate),
    queryKey: [LEADERBOARD_QUERY, sdate, edate],
  });
}

export function useGetMyLeaderboardPosition(
  initData: string,
  sdate?: string,
  edate?: string,
) {
  return useQuery({
    queryFn: () => getMyLeaderboardPosition(initData, sdate, edate),
    queryKey: [MY_LEADERBOARD_POSITION_QUERY, initData, sdate, edate],
  });
}
