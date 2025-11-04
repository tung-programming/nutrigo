import axios from 'axios';
import { logger } from './logger';

class HttpClient {
  private client = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  constructor(baseURL?: string) {
    if (baseURL) {
      this.client.defaults.baseURL = baseURL;
    }
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`🚀 Request → ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`✅ Response ← ${response.config.url} [${response.status}]`);
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error('⚠️ Response error:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
          });
        } else {
          logger.error('🌐 Network error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // -------------------- HTTP METHODS --------------------

  async get<T = unknown>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
export default HttpClient;
