import { Buffer } from 'buffer';

import CryptoJS from 'crypto-js';

export function base64Encode(data: string) {
  return Buffer.from(data).toString('base64');
}

export function base64Decode(data: string) {
  return Buffer.from(data, 'base64').toString();
}

export function encryptAES(text: string, secretKey: string) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decryptAES(text: string, secretKey: string) {
  return CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);
}

export function hashSHA256(
  text: string | CryptoJS.lib.WordArray,
  secretKey: string,
) {
  return CryptoJS.HmacSHA256(text, secretKey).toString();
}
