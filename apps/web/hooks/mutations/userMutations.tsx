import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateUserDto, User } from '@farty-bera/api-lib';

import { updateUser } from '../../services';

type UpdateUserMutation = {
  address: string;
  updateUserDto: UpdateUserDto;
};

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
