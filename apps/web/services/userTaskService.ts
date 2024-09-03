/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import {
  CreateUserTaskDto,
  SignDto,
  UserTask,
  UserTasksApi,
} from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const userTasksApiClient = ApiClient.use(UserTasksApi);

export async function createUserTask(
  createUserTaskDto: CreateUserTaskDto,
  signDto: SignDto,
) {
  try {
    const response = await userTasksApiClient.userTaskControllerCreate(
      createUserTaskDto,
      {
        headers: {
          ...signDto,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function getUserTasks(userId?: string): Promise<UserTask[]> {
  try {
    const response = await userTasksApiClient.userTaskControllerFindAll(userId);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
