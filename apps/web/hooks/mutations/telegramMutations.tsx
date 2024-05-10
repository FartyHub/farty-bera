import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SendTelegramGameScoreDto } from '@farty-bera/api-lib';

import { sendGameScore } from '../../services';

export const useSendGameScore = (
  mutationOptions: MutationOptions<
    void,
    AxiosError<{ message: string }>,
    SendTelegramGameScoreDto
  > = {},
) =>
  useMutation({
    mutationFn: sendGameScore,
    ...mutationOptions,
  });
