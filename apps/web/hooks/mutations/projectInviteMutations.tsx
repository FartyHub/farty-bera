import { MutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateProjectInviteDto, ProjectInvite } from '@farty-bera/api-lib';

import { createProjectInvite } from '../../services';

export const useCreateProjectInvite = (
  mutationOptions: MutationOptions<
    ProjectInvite,
    AxiosError<{ message: string }>,
    CreateProjectInviteDto
  > = {},
) =>
  useMutation({
    mutationFn: createProjectInvite,
    ...mutationOptions,
  });
