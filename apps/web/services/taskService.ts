/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import { Task, TasksApi } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const tasksApiClient = ApiClient.use(TasksApi);

export async function getTask(id: string): Promise<Task> {
  try {
    const response = await tasksApiClient.taskControllerFindOne(id);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await tasksApiClient.taskControllerFindAll();

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
