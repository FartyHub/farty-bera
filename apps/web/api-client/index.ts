import { AxiosRequestConfig } from 'axios';

import { createApiClient, setTraceId } from '@farty-bera/api-spec';

function interceptAuthRequest(config: AxiosRequestConfig): AxiosRequestConfig {
  // By default all cookies will be included in the request
  config.withCredentials = true;

  setTraceId(config);

  return config;
}

const ApiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || '',
  interceptAuthRequest,
);

export default ApiClient;
