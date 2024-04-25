import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CheckInviteCodeDto, User } from '@farty-bera/api-lib';

import { checkInviteCode } from '../../services';

export const useCheckInviteCode = (
  mutationOptions: MutationOptions<
    User,
    AxiosError<{ message: string }>,
    CheckInviteCodeDto
  > = {},
) =>
  useMutation({
    mutationFn: checkInviteCode,
    ...mutationOptions,
  });
