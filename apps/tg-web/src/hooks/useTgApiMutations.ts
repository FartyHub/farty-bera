import { MutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  getFartyChannelChatMember,
  getFartyDenChatMember,
  getInvoice,
  saveUser,
} from '../services/tgApiService';

const FARTY_DEN_CHAT_MEMBER_QUERY = 'FARTY_DEN_CHAT_MEMBER';
const FARTY_CHANNEL_CHAT_MEMBER_QUERY = 'FARTY_CHANNEL_CHAT_MEMBER';

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

export const useSaveUser = (
  mutationOptions?: MutationOptions<
    any,
    AxiosError<{ message: string }>,
    string
  >,
) =>
  useMutation({
    mutationFn: (initData) => saveUser(initData),
    ...mutationOptions,
  });

export function useGetFartyDenChatMember(initData: string) {
  return useQuery({
    queryFn: () => getFartyDenChatMember(initData),
    queryKey: [FARTY_DEN_CHAT_MEMBER_QUERY, initData],
  });
}

export function useGetFartyChannelChatMember(initData: string) {
  return useQuery({
    queryFn: () => getFartyChannelChatMember(initData),
    queryKey: [FARTY_CHANNEL_CHAT_MEMBER_QUERY, initData],
  });
}
