import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateUserTaskDto, SignDto, UserTask } from '@farty-bera/api-lib';

import { createUserTask } from '../../services';

type CreateUserTaskMutation = {
  createUserTaskDto: CreateUserTaskDto;
  signDto: SignDto;
};

export const useCreateUserTask = (
  mutationOptions: MutationOptions<
    UserTask,
    AxiosError<{ message: string }>,
    CreateUserTaskMutation
  > = {},
) =>
  useMutation({
    mutationFn: ({ createUserTaskDto, signDto }: CreateUserTaskMutation) =>
      createUserTask(createUserTaskDto, signDto),
    ...mutationOptions,
  });
