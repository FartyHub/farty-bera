/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { saveUser } from '../../services/tgApiService';

export const useSaveUser = (
  mutationOptions?: MutationOptions<
    any,
    AxiosError<{ message: string }>,
    {
      address: string;
      initData: string;
    }
  >,
) =>
  useMutation({
    mutationFn: ({ address, initData }) => saveUser(address, initData),
    ...mutationOptions,
  });
