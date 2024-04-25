/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

import {
  CreateProjectInviteDto,
  ProjectInvite,
  ProjectInvitesApi,
} from '@farty-bera/api-lib';

import ApiClient from '../api-client';

export const projectInvitesApi = ApiClient.use(ProjectInvitesApi);

export async function createProjectInvite(
  createProjectInviteDto: CreateProjectInviteDto,
): Promise<ProjectInvite> {
  try {
    const response = await projectInvitesApi.projectInviteControllerCreate(
      createProjectInviteDto,
    );

    return response.data;
  } catch (error) {
    throw new Error(((error as AxiosError)?.response?.data as any)?.message);
  }
}
