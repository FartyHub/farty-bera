/* eslint-disable */
import { v4 as uuid } from 'uuid';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const ERROR_MONITORING = {
  X_TRACE_ID: 'X-TRACE_ID',
  TRACE_ID: 'traceId',
};

function interceptErrorResponse(error: AxiosError) {
  throw error;
}

function interceptAuthRequest(config: AxiosRequestConfig): AxiosRequestConfig {
  if (config?.headers) {
    config.headers[ERROR_MONITORING.X_TRACE_ID] = uuid();
  }

  const token = Cookies.get('access_token');

  config.headers = {
    ...config.headers,
    credentials: 'include',
  };

  if (token) {
    config.headers = {
      ...config.headers,
      withCredentials: true,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
}

export function setTraceId(config: AxiosRequestConfig) {
  if (!config.headers?.[ERROR_MONITORING.X_TRACE_ID]) {
    config.headers = {
      ...config.headers,
      [ERROR_MONITORING.X_TRACE_ID]: uuid(),
    };
  }

  return config;
}

export function createApiClient(
  baseURL: string,
  interceptResponse: unknown = interceptAuthRequest,
) {
  const axiosInstance = axios.create();

  axiosInstance.interceptors.response.use((res) => res, interceptErrorResponse);

  axiosInstance.interceptors.request.use(
    interceptResponse as any,
    interceptErrorResponse,
  );

  return {
    axiosInstance,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    use: <ApiType>(api: new (...args: any[]) => ApiType): ApiType =>
      new api(undefined, baseURL, axiosInstance),
  };
}
