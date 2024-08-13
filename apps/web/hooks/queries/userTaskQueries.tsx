import { useQuery } from '@tanstack/react-query';

import { getUserTasks } from '../../services';

export const USER_TASKS_QUERY = 'TASKS';

export function useUserTasksQuery(userId: string) {
  return useQuery({
    queryFn: () => getUserTasks(userId),
    queryKey: [USER_TASKS_QUERY, userId],
  });
}
