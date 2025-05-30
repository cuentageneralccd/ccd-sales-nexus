
// Simulación de API real para el CRM
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

// Simulación de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Configuración de la API
const API_CONFIG = {
  baseUrl: 'https://api.ccdcrm.com',
  timeout: 10000,
  retries: 3
};

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    await delay(Math.random() * 1000 + 500); // Simular latencia de red
    
    // Simulación de respuestas exitosas vs errores
    const shouldFail = Math.random() < 0.05; // 5% de probabilidad de error
    
    if (shouldFail) {
      throw new Error('Error de conexión con el servidor');
    }
    
    console.log(`API Call: ${endpoint}`, options);
    
    return {
      data: {} as T,
      success: true,
      message: 'Operación exitosa'
    };
  }

  // Leads endpoints
  async getLeads(filters?: any): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/leads', { method: 'GET' });
  }

  async createLead(leadData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  }

  async updateLead(id: string, leadData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData)
    });
  }

  // Campaigns endpoints
  async getCampaigns(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/campaigns');
  }

  async createCampaign(campaignData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  async updateCampaignStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/campaigns/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Financial endpoints
  async getFinancialMetrics(): Promise<ApiResponse<any>> {
    return this.makeRequest('/analytics/financial');
  }

  async getRevenueBySource(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/analytics/revenue-sources');
  }

  // Communication endpoints
  async sendMessage(messageData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/communication/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getMessageTemplates(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/communication/templates');
  }

  // Vicidial integration
  async initiateCall(phoneNumber: string, agentId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/vicidial/call', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, agentId })
    });
  }

  async getAgentStatus(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/vicidial/agents');
  }

  async getActiveCalls(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/vicidial/calls/active');
  }
}

export const apiService = new ApiService();
