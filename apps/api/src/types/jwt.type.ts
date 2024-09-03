import { Request } from 'express';

import { SignDto } from '../app/common';
import { User } from '../app/user/entities/user.entity';

export type AccessToken = {
  accessToken: string;
};

export type AuthenticatedRequest = Request &
  AccessToken &
  Partial<SignDto> & {
    user: User;
  };

export type DecodedAccessToken = Request &
  AccessToken & {
    createdAt: Date;
    userAddress: string;
  };
