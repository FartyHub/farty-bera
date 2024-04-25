import { useQuery } from '@tanstack/react-query';

import { getUser } from '../../services';

const USER_QUERY = 'USER';

export function useUserQuery(address: string) {
  return useQuery({
    queryFn: () => getUser(address),
    queryKey: [USER_QUERY, address],
  });
}
