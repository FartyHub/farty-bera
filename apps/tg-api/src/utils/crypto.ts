import crypto from 'crypto';

export function generateRandomText(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export function generateHmacSha256(
  data: string | Buffer,
  key: string,
  encoding?: crypto.BinaryToTextEncoding,
): string | Buffer {
  return crypto.createHmac('sha256', key).update(data).digest(encoding);
}
