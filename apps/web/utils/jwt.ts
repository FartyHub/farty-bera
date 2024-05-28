import { isAfter } from 'date-fns';

export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = Buffer.from(base64, 'base64').toString('utf-8');

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.log('error', error);

    return null;
  }
}

export function checkHasTokenValueExpired(otpToken: string) {
  if (otpToken) {
    const decodedValues = decodeJWT(otpToken);

    return isAfter(new Date(), new Date(decodedValues.expiration));
  }

  return false;
}

export function checkIsCurrentUser(otpToken: string, address: string) {
  if (otpToken) {
    const decodedValues = decodeJWT(otpToken);

    return decodedValues.userAddress === address;
  }

  return false;
}

export function getCookie(name: string) {
  if (typeof document === 'undefined') return;

  const value = '; ' + document.cookie;
  const decodedValue = decodeURIComponent(value);
  const parts = decodedValue.split('; ' + name + '=');

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}
