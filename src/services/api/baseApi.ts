
// Base API configuration and common methods
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Simulation of network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API configuration
export const API_CONFIG = {
  baseUrl: 'https://api.ccdcrm.com',
  timeout: 10000,
  retries: 3
};

export class BaseApiService {
  protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    await delay(Math.random() * 1000 + 500); // Simulate network latency
    
    // Simulate successful responses vs errors
    const shouldFail = Math.random() < 0.05; // 5% chance of error
    
    if (shouldFail) {
      throw new Error('Connection error with server');
    }
    
    console.log(`API Call: ${endpoint}`, options);
    
    return {
      data: {} as T,
      success: true,
      message: 'Operation successful'
    };
  }
}
