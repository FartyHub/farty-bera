import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SignDto, UpdateUserDto, User } from '@farty-bera/api-lib';

import { login, updateUser } from '../../services';

type UpdateUserMutation = {
  address: string;
  updateUserDto: UpdateUserDto;
};

export const useLogin = (
  mutationOptions: MutationOptions<
    void,
    AxiosError<{ message: string }>,
    SignDto
  > = {},
) =>
  useMutation({
    mutationFn: login,
    ...mutationOptions,
  });

export const useUpdateUser = (
  mutationOptions: MutationOptions<
    User,
    AxiosError<{ message: string }>,
    UpdateUserMutation
  > = {},
) =>
  useMutation({
    mutationFn: ({ address, updateUserDto }: UpdateUserMutation) =>
      updateUser(address, updateUserDto),
    ...mutationOptions,
  });
