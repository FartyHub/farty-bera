/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersApi,
} from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const usersApiClient = ApiClient.use(UsersApi);

export async function getUsers(): Promise<User[]> {
  try {
    const response = await usersApiClient.userControllerFindAll();

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function getUser(
  address: string,
  shouldError = true,
): Promise<User | undefined> {
  try {
    const response = await usersApiClient.userControllerFindOne(address);

    return response.data;
  } catch (error) {
    if (!shouldError) {
      return undefined;
    }

    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function createUser(data: CreateUserDto): Promise<User> {
  try {
    const response = await usersApiClient.userControllerCreate(data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function updateUser(
  address: string,
  data: UpdateUserDto,
): Promise<User> {
  try {
    const response = await usersApiClient.userControllerUpdate(address, data);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function deleteUser(address: string): Promise<boolean> {
  try {
    const response = await usersApiClient.userControllerRemove(address);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}

export async function generateInviteCode(address: string): Promise<string> {
  try {
    const response =
      await usersApiClient.userControllerGenerateInviteCode(address);

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
