/* eslint-disable no-magic-numbers */
import { customAlphabet } from 'nanoid';

export type SignInMessage = {
  address: string;
  chainId: number | string;
  domain: string;
  issuedAt: string;
  nonce: string;
  statement: string;
  uri: string;
  version: string;
};

// EIP-4361 formated message, ready for EIP-191 signing.
export const get4361Message = ({
  address,
  chainId,
  domain,
  issuedAt,
  nonce,
  statement,
  uri,
  version,
}: SignInMessage): string => {
  const header = `${domain} wants you to sign in with your Ethereum account:`;
  const uriField = `URI: ${uri}`;
  let prefix = [header, address].join('\n');
  const versionField = `Version: ${version}`;

  const chainField = `Chain ID: ` + chainId || '1';

  const nonceField = `Nonce: ${nonce}`;

  const suffixArray = [uriField, versionField, chainField, nonceField];

  suffixArray.push(`Issued At: ${issuedAt}`);

  const suffix = suffixArray.join('\n');
  prefix = [prefix, statement].join('\n\n');
  if (statement) {
    prefix += '\n';
  }

  return [prefix, suffix].join('\n');
};

export const getCustomNaNoId = (): string => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

  return nanoid();
};
