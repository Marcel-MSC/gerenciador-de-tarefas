import type { IHttpClient } from '@/core/ports';
import { ApiError } from './errors';

const baseUrl = import.meta.env.VITE_API_BASE ?? '/api';

export class ApiClient implements IHttpClient {
  private extraHeaders: Record<string, string> = {};

  setHeaders(headers: Record<string, string>) {
    this.extraHeaders = { ...this.extraHeaders, ...headers };
  }

  clearHeader(key: string) {
    const { [key]: _, ...rest } = this.extraHeaders;
    this.extraHeaders = rest;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.extraHeaders,
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(
        (body as { message?: string }).message ?? response.statusText,
        response.status,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
  }

  patch<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers,
    });
  }

  delete(url: string, headers?: Record<string, string>): Promise<void> {
    return this.request<void>(url, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
