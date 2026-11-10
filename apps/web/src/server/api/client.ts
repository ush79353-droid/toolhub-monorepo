import 'server-only';
import type { ApiResponse } from '@mega-tools/shared';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, status = 500, code = 'API_CLIENT_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ServerApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor() {
    const internalUrl = process.env.API_INTERNAL_URL;
    if (!internalUrl && process.env.NODE_ENV === 'production') {
      throw new Error('API_INTERNAL_URL environment variable is not defined.');
    }
    this.baseUrl = (internalUrl || 'http://localhost:5001/api/v1').replace(/\/$/, '');
    this.defaultTimeout = Number(process.env.API_TIMEOUT_MS) || 10000;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${normalizedEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { body, timeoutMs = this.defaultTimeout, params, headers, ...restOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = (await response.json()) as ApiResponse<T>;

      if (!response.ok || !json.success) {
        throw new ApiClientError(
          json.error?.message || `API request failed with status ${response.status}`,
          response.status,
          json.error?.code || 'API_ERROR',
          json.error?.details
        );
      }

      return json;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(
          `Request timed out after ${timeoutMs}ms for ${url}`,
          504,
          'TIMEOUT_ERROR'
        );
      }

      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown network error occurred',
        500,
        'NETWORK_ERROR',
        error
      );
    }
  }

  public async get<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  public async delete<T = unknown>(
    endpoint: string,
    options?: Omit<RequestOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Singleton server-side client instance
export const serverApi = new ServerApiClient();
