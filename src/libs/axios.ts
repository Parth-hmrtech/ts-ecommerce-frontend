import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3009/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiRequestOptions extends AxiosRequestConfig {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
}

export interface ApiResponse<T = any> {
  status: number;
  data: T;
}

export const apiRequest = async <T = any>({
  method,
  url,
  headers,
  data,
  params,
}: ApiRequestOptions): Promise<ApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data,
      params,
    };

    const response: AxiosResponse<T> = await axiosInstance.request(config);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || 'Request failed.',
        error: error.response.data,
      };
    }

    if (error.request) {
      throw { message: 'No response from server.' };
    }

    throw { message: 'Unexpected error occurred.' };
  }
};

export type { ApiResponse as APISuccessResponse };
