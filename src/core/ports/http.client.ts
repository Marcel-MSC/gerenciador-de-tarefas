export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface IHttpClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;
  post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T>;
  patch<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T>;
  delete(url: string, headers?: Record<string, string>): Promise<void>;
}
