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

  // Advisor Performance endpoints
  async getAdvisorMetrics(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/advisors/metrics');
  }

  async updateAdvisorStatus(advisorId: string, status: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/advisors/${advisorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async createQualityReview(reviewData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/quality/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async getQualityReviews(advisorId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = advisorId ? `/quality/reviews?advisorId=${advisorId}` : '/quality/reviews';
    return this.makeRequest(endpoint);
  }

  // Lead Classification endpoints
  async getLeadClassifications(filters?: any): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/leads/classifications', { method: 'GET' });
  }

  async updateLeadClassification(leadId: string, classification: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${leadId}/classification`, {
      method: 'PUT',
      body: JSON.stringify(classification)
    });
  }

  async updateLeadStage(leadId: string, stage: string, notes: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${leadId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, notes })
    });
  }

  async addLeadObservation(leadId: string, observation: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${leadId}/observations`, {
      method: 'POST',
      body: JSON.stringify(observation)
    });
  }

  async applyPromotion(leadId: string, promotionId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${leadId}/promotions/${promotionId}/apply`, {
      method: 'POST'
    });
  }

  // Follow-up Tasks endpoints
  async getFollowUpTasks(advisorId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = advisorId ? `/tasks/followup?advisorId=${advisorId}` : '/tasks/followup';
    return this.makeRequest(endpoint);
  }

  async createFollowUpTask(taskData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/tasks/followup', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateFollowUpTask(taskId: string, updates: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/tasks/followup/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async completeFollowUpTask(taskId: string, result: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/tasks/followup/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ result, completedDate: new Date().toISOString() })
    });
  }

  // Analytics endpoints for new features
  async getAdvisorPerformanceReport(dateRange: { start: string; end: string }): Promise<ApiResponse<any>> {
    return this.makeRequest('/analytics/advisor-performance', {
      method: 'POST',
      body: JSON.stringify(dateRange)
    });
  }

  async getLeadConversionFunnel(): Promise<ApiResponse<any>> {
    return this.makeRequest('/analytics/lead-funnel');
  }

  async getQualityTrends(advisorId?: string): Promise<ApiResponse<any>> {
    const endpoint = advisorId ? `/analytics/quality-trends?advisorId=${advisorId}` : '/analytics/quality-trends';
    return this.makeRequest(endpoint);
  }
}

export const apiService = new ApiService();
