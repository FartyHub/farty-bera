import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getInvoice } from '../services/tgApiService';

export const useGetNewInvoice = (
  mutationOptions?: MutationOptions<
    {
      id: string;
      url: string;
    },
    AxiosError<{ message: string }>
  >,
) =>
  useMutation({
    mutationFn: getInvoice,
    ...mutationOptions,
  });
