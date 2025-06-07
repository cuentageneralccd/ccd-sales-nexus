
// Main API service that combines all API modules
import { LeadsApiService } from './api/leadsApi';
import { CampaignsApiService } from './api/campaignsApi';
import { PromotionsApiService } from './api/promotionsApi';
import { VicidialApiService } from './api/vicidialApi';
import { BaseApiService, ApiResponse } from './api/baseApi';

class ApiService extends BaseApiService {
  private leadsApi = new LeadsApiService();
  private campaignsApi = new CampaignsApiService();
  private promotionsApi = new PromotionsApiService();
  private vicidialApi = new VicidialApiService();

  // Leads methods
  async getLeads(filters?: any) { return this.leadsApi.getLeads(filters); }
  async createLead(leadData: any) { return this.leadsApi.createLead(leadData); }
  async updateLead(id: string, leadData: any) { return this.leadsApi.updateLead(id, leadData); }
  async deleteLead(id: string) { return this.leadsApi.deleteLead(id); }
  async activateLead(leadId: string, advisorId: string) { return this.leadsApi.activateLead(leadId, advisorId); }
  async getLeadByPhone(phoneNumber: string) { return this.leadsApi.getLeadByPhone(phoneNumber); }
  async getLeadFullHistory(phoneNumber: string) { return this.leadsApi.getLeadFullHistory(phoneNumber); }

  // Campaigns methods
  async getCampaigns() { return this.campaignsApi.getCampaigns(); }
  async createCampaign(campaignData: any) { return this.campaignsApi.createCampaign(campaignData); }
  async updateCampaignStatus(id: string, status: string) { return this.campaignsApi.updateCampaignStatus(id, status); }

  // Promotions methods
  async getLeadPromotions(phoneNumber?: string) { return this.promotionsApi.getLeadPromotions(phoneNumber); }
  async addLeadPromotion(promotionData: any) { return this.promotionsApi.addLeadPromotion(promotionData); }
  async updateLeadPromotion(promotionId: string, updates: any) { return this.promotionsApi.updateLeadPromotion(promotionId, updates); }
  async getLeadInteractions(phoneNumber?: string) { return this.promotionsApi.getLeadInteractions(phoneNumber); }
  async addLeadInteraction(interactionData: any) { return this.promotionsApi.addLeadInteraction(interactionData); }

  // Vicidial methods
  async initiateCall(phoneNumber: string, agentId?: string) { return this.vicidialApi.initiateCall(phoneNumber, agentId); }
  async getAgentStatus() { return this.vicidialApi.getAgentStatus(); }
  async getActiveCalls() { return this.vicidialApi.getActiveCalls(); }

  // Additional methods that weren't refactored
  async getFinancialMetrics(): Promise<ApiResponse<any>> {
    return this.makeRequest('/analytics/financial');
  }

  async getRevenueBySource(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/analytics/revenue-sources');
  }

  async sendMessage(messageData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/communication/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getMessageTemplates(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/communication/templates');
  }

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

  async getCampaignProfitability(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/analytics/campaign-profitability');
  }

  async getCampaignROI(campaignCode: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/analytics/campaign-roi/${campaignCode}`);
  }

  async getLeadPromotionHistory(phoneNumber: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/leads/promotions/history/${phoneNumber}`);
  }
}

export const apiService = new ApiService();
