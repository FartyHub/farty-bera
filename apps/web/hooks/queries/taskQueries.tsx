import { useQuery } from '@tanstack/react-query';

import { getTask, getTasks } from '../../services';

export const TASKS_QUERY = 'TASKS';
export const TASK_QUERY = 'TASK';

export function useTaskQuery(id: string) {
  return useQuery({
    queryFn: () => getTask(id),
    queryKey: [TASK_QUERY, id],
  });
}

export function useTasksQuery() {
  return useQuery({
    queryFn: () => getTasks(),
    queryKey: [TASKS_QUERY],
  });
}
