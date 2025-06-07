
// Main Vicidial service that uses the core service
import { vicidialCore, VicidialAgent, VicidialCall, VicidialLead } from './vicidial/vicidialCore';

interface SearchFilters {
  phoneNumber?: string;
  status?: string;
  campaign?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

class VicidialService {
  async getAgentStatus(): Promise<VicidialAgent[]> {
    return vicidialCore.getAgentStatus();
  }

  async getLoggedInAgents(): Promise<VicidialAgent[]> {
    const agents = await vicidialCore.getAgentStatus();
    return agents.filter(agent => agent.status !== 'LOGOUT' as any);
  }

  async initiateManualCall(phoneNumber: string, user: string, campaign?: string, leadId?: string): Promise<any> {
    return vicidialCore.initiateManualCall({
      phone_number: phoneNumber,
      user: user,
      campaign: campaign,
      lead_id: leadId
    });
  }

  async pauseAgent(user: string, pauseCode?: string): Promise<any> {
    return vicidialCore.pauseAgent({ user, pause_code: pauseCode });
  }

  async unpauseAgent(user: string): Promise<any> {
    return vicidialCore.unpauseAgent({ user });
  }

  // Additional methods needed by hooks
  async searchLeads(filters: SearchFilters): Promise<VicidialLead[]> {
    // Simulate search functionality
    console.log('Searching leads with filters:', filters);
    return [];
  }

  async updateLeadStatus(leadId: string, status: string, notes?: string): Promise<any> {
    console.log('Updating lead status:', leadId, status, notes);
    return { success: true };
  }

  async getCallLog(agentId?: string, dateRange?: { start: string; end: string }): Promise<any[]> {
    console.log('Getting call log for agent:', agentId, dateRange);
    return [];
  }
}

export const vicidialService = new VicidialService();
export type { VicidialAgent, VicidialCall, VicidialLead };
