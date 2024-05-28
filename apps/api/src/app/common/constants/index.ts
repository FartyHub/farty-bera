import { SetMetadata } from '@nestjs/common';

export * from './applications';
export * from './config-keys';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_API_KEY = 'isApiKey';
export const IS_BOT = 'isBot';
export const ACCESS_TOKEN = 'farty_token';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const ApiKey = () => SetMetadata(IS_API_KEY, true);
export const Bot = () => SetMetadata(IS_BOT, true);
