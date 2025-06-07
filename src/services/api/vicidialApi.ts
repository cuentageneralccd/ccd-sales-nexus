
import { BaseApiService, ApiResponse } from './baseApi';

export class VicidialApiService extends BaseApiService {
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

  async pauseAgent(agentId: string, pauseCode?: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/vicidial/agent/pause', {
      method: 'POST',
      body: JSON.stringify({ agentId, pauseCode })
    });
  }

  async unpauseAgent(agentId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/vicidial/agent/unpause', {
      method: 'POST',
      body: JSON.stringify({ agentId })
    });
  }
}
