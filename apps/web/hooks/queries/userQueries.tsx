import { useQuery } from '@tanstack/react-query';

import {
  getInvitedUsersCount,
  getTopRanks,
  getUser,
  getUserRanking,
} from '../../services';

export const USER_QUERY = 'USER';
export const USER_INVITED_USERS_COUNT_QUERY = 'USER_INVITED_USERS_COUNT';
export const USER_RANK_QUERY = 'USER_RANK';
export const TOP_RANKS_QUERY = 'TOP_RANKS';

export function useUserQuery(address: string) {
  return useQuery({
    queryFn: () => getUser(address),
    queryKey: [USER_QUERY, address],
  });
}

export function useGetInvitedUsersCount() {
  return useQuery({
    queryFn: () => getInvitedUsersCount(),
    queryKey: [USER_INVITED_USERS_COUNT_QUERY],
  });
}

export function useGetUserRank(address: string) {
  return useQuery({
    enabled: !!address,
    queryFn: () => getUserRanking(address),
    queryKey: [USER_RANK_QUERY, address],
  });
}

export function useGetTopRanks() {
  return useQuery({
    queryFn: () => getTopRanks(),
    queryKey: [TOP_RANKS_QUERY],
  });
}
