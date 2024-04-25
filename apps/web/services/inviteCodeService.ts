/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import { CheckInviteCodeDto, InviteCodeApi, User } from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const inviteCodesApiClient = ApiClient.use(InviteCodeApi);

export async function checkInviteCode(
  checkInviteCodeDto: CheckInviteCodeDto,
): Promise<User> {
  try {
    const response =
      await inviteCodesApiClient.inviteCodeControllerCheckInviteCode(
        checkInviteCodeDto,
      );

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
