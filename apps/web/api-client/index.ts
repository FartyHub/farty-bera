import { AxiosRequestConfig } from 'axios';

import { createApiClient, setTraceId } from '@farty-bera/api-spec';

function interceptAuthRequest(config: AxiosRequestConfig): AxiosRequestConfig {
  // By default all cookies will be included in the request
  config.withCredentials = true;
  const headers = {
    ...config.headers,
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY || '',
  };

  config.headers = headers;

  setTraceId(config);

  return config;
}

const ApiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || '',
  interceptAuthRequest,
);

export default ApiClient;
