
import { BaseApiService, ApiResponse } from './baseApi';

export class LeadsApiService extends BaseApiService {
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

  async deleteLead(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${id}`, {
      method: 'DELETE'
    });
  }

  async activateLead(leadId: string, advisorId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/${leadId}/activate`, {
      method: 'POST',
      body: JSON.stringify({ advisorId, activationDate: new Date().toISOString() })
    });
  }

  async getLeadByPhone(phoneNumber: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/by-phone/${phoneNumber}`);
  }

  async getLeadFullHistory(phoneNumber: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/history/${phoneNumber}`);
  }
}
