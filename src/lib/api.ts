// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// HTTP Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Don't set Content-Type for FormData - let browser handle it
    const config: RequestInit = {
      ...options,
    };

    // Only set Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else {
      // For FormData, only include other headers, not Content-Type
      config.headers = {
        ...options.headers,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            errorData = { error: text || `HTTP error! status: ${response.status}` };
          }
        } catch {
          errorData = { error: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // If not JSON, treat as error
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'POST' };
    
    if (data instanceof FormData) {
      options.body = data;
      // Don't set Content-Type for FormData - let browser handle it
    } else if (data) {
      options.body = JSON.stringify(data);
      options.headers = { 'Content-Type': 'application/json' };
    }
    
    return this.request<T>(endpoint, options);
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'PUT' };
    
    if (data instanceof FormData) {
      options.body = data;
      // Don't set Content-Type for FormData - let browser handle it
    } else if (data) {
      options.body = JSON.stringify(data);
      options.headers = { 'Content-Type': 'application/json' };
    }
    
    return this.request<T>(endpoint, options);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload helper
  createFormData(data: Record<string, any>, files?: Record<string, File>): FormData {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    // Add files
    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
    }
    
    return formData;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);