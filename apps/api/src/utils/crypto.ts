import crypto from 'crypto';

import { BadRequestException } from '@nestjs/common';

import { SignDto } from '../app/common';

import {
  AccountNotFoundError,
  ChainSdkFactory,
  ChainType,
  VerifyMessageOptions,
} from './chain-sdk';

export function generateRandomText(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export async function verifyAuthenticationMessage(signDto: SignDto) {
  const { key, message, signature } = signDto;
  const chainProvider = ChainSdkFactory.getChainSdk(ChainType.Evm);

  if (!chainProvider) {
    throw new Error("Invalid chain type, can't find chain provider.");
  }

  let verified = false;
  const verifyMessageOptions: VerifyMessageOptions = {};

  try {
    verified = await chainProvider.verifyMessage(
      message,
      signature,
      key,
      verifyMessageOptions,
    );
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      throw new BadRequestException(err.message, {
        description: 'Account not found',
      });
    }
    throw err;
  }

  const address = verified ? chainProvider.getAddressFromPublicKey(key) : '';

  return {
    address,
    verified,
  };
}
