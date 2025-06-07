
import { BaseApiService, ApiResponse } from './baseApi';

export class PromotionsApiService extends BaseApiService {
  async getLeadPromotions(phoneNumber?: string): Promise<ApiResponse<any[]>> {
    const endpoint = phoneNumber ? `/leads/promotions?phone=${phoneNumber}` : '/leads/promotions';
    return this.makeRequest(endpoint);
  }

  async addLeadPromotion(promotionData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/leads/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData)
    });
  }

  async updateLeadPromotion(promotionId: string, updates: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/leads/promotions/${promotionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async getLeadInteractions(phoneNumber?: string): Promise<ApiResponse<any[]>> {
    const endpoint = phoneNumber ? `/leads/interactions?phone=${phoneNumber}` : '/leads/interactions';
    return this.makeRequest(endpoint);
  }

  async addLeadInteraction(interactionData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/leads/interactions', {
      method: 'POST',
      body: JSON.stringify(interactionData)
    });
  }
}
