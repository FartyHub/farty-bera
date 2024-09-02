/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import { OAuthResponseDto, TwitterApi } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const twitterApiClient = ApiClient.use(TwitterApi);

export async function getTwitterOAuthLink(): Promise<OAuthResponseDto> {
  try {
    const response = await twitterApiClient.twitterControllerGetOAuthLink();

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
