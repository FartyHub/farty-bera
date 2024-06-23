import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getInvoice } from '../services/tgApiService';

export const useGetNewInvoice = (
  mutationOptions?: MutationOptions<
    {
      id: string;
      url: string;
    },
    AxiosError<{ message: string }>,
    string
  >,
) =>
  useMutation({
    mutationFn: getInvoice,
    ...mutationOptions,
  });
