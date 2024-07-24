import { createApiClient, setTraceId } from '@farty-bera/api-spec';
import { AxiosRequestConfig } from 'axios';
import { API_URL, X_API_KEY } from '../constants';

function interceptAuthRequest(config: AxiosRequestConfig): AxiosRequestConfig {
  // By default all cookies will be included in the request
  config.withCredentials = true;
  const headers = {
    ...config.headers,
    'x-api-key': X_API_KEY || '',
  };

  config.headers = headers;

  setTraceId(config);

  return config;
}

const ApiClient = createApiClient(
  API_URL || '',
  interceptAuthRequest,
);

export default ApiClient;
