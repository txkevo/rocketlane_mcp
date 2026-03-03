import axios, { AxiosInstance, AxiosError } from "axios";

export interface PaginationParams {
  pageSize?: number;
  pageToken?: string;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    pageSize: number;
    hasMore: boolean;
    totalRecordCount: number;
    nextPage?: string;
    nextPageToken?: string;
  };
}

export class RocketlaneClient {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: "https://api.rocketlane.com/api/1.0",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.get<T>(path, { params });
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.post<T>(path, data);
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.put<T>(path, data);
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  async delete<T>(path: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, { data });
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  private formatError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors) && errors.length > 0) {
        const msg = errors
          .map((e: { errorMessage?: string; field?: string }) =>
            e.field ? `[${e.field}] ${e.errorMessage}` : e.errorMessage
          )
          .join("; ");
        return new Error(`Rocketlane API error (${status}): ${msg}`);
      }

      const retryAfter = error.response?.headers?.["x-retry-after"];
      if (status === 429) {
        return new Error(
          `Rate limited. Retry after ${retryAfter ?? "unknown"} seconds.`
        );
      }

      return new Error(
        `Rocketlane API error (${status}): ${error.message}`
      );
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
