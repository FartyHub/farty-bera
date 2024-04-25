import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateScoreDto, Score } from '@farty-bera/api-lib';

import { createScore } from '../../services';

export const useCreateScore = (
  mutationOptions: MutationOptions<
    Score,
    AxiosError<{ message: string }>,
    CreateScoreDto
  > = {},
) =>
  useMutation({
    mutationFn: createScore,
    ...mutationOptions,
  });
