import { CreateUserDto, UpdateUserDto, UsersApi } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const usersApiClient = ApiClient.use(UsersApi);

export async function getUsers() {
  return usersApiClient.userControllerFindAll();
}

export async function getUser(address: string) {
  return usersApiClient.userControllerFindOne(address);
}

export async function createUser(data: CreateUserDto) {
  return usersApiClient.userControllerCreate(data);
}

export async function updateUser(address: string, data: UpdateUserDto) {
  return usersApiClient.userControllerUpdate(address, data);
}

export async function deleteUser(address: string) {
  return usersApiClient.userControllerRemove(address);
}
