
import { BaseApiService, ApiResponse } from './baseApi';

export class CampaignsApiService extends BaseApiService {
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

  async getCampaignStats(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/campaigns/stats');
  }
}
