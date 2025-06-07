
// Main Vicidial service that uses the core service
import { vicidialCore, VicidialAgent, VicidialCall, VicidialLead } from './vicidial/vicidialCore';

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
}

export const vicidialService = new VicidialService();
export type { VicidialAgent, VicidialCall, VicidialLead };
