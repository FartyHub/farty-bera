/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import { SendTelegramGameScoreDto, TelegramApi } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const telegramApiClient = ApiClient.use(TelegramApi);

export async function sendGameScore(
  sendTelegramGameScoreDto: SendTelegramGameScoreDto,
) {
  try {
    await telegramApiClient.telegramControllerSendGameScore(
      sendTelegramGameScoreDto,
    );
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
