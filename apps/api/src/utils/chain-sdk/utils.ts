import * as nacl from 'tweetnacl';

/**
 * Convert text to lower case
 * @param text The text to convert
 * @returns lower case text
 */
export function toLowerCase(text: string): string {
  // ??, see link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
  return String(text ?? '').toLowerCase();
}

/**
 * The function alias nacl.sign.detached.verify, to verify message.
 */
export const naclSignDetachedVerify = nacl.sign.detached.verify;
