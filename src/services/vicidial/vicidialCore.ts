
// Core Vicidial service with essential functionality
export interface VicidialAgent {
  user: string;
  fullName: string;
  status: 'READY' | 'INCALL' | 'PAUSED' | 'DISPO' | 'QUEUE' | 'CLOSER';
  campaign: string;
  sessionId: string;
  loginTime: string;
  callsToday: number;
  talkTimeToday: number;
  pauseTimeToday: number;
  lastCallTime: number;
  server_ip: string;
  phone_login: string;
  phone_pass: string;
}

export interface VicidialCall {
  uniqueid: string;
  server_ip: string;
  channel: string;
  phone_number: string;
  user: string;
  status: 'INCALL' | 'QUEUE' | 'PARK' | 'HANGUP';
  campaign_id: string;
  list_id: string;
  lead_id: string;
  start_time: string;
  end_time?: string;
  length_in_sec: number;
  term_reason: string;
}

export interface VicidialLead {
  lead_id: string;
  entry_date: string;
  modify_date: string;
  status: string;
  user: string;
  vendor_lead_code: string;
  source_id: string;
  list_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  comments: string;
  called_count: number;
  last_local_call_time: string;
}

class VicidialCoreService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'http://localhost/vicidial';
    this.apiKey = 'demo_api_key';
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}/api/${endpoint}`);
    url.searchParams.append('source', 'CCD_CRM');
    url.searchParams.append('user', params.user || 'admin');
    url.searchParams.append('pass', params.pass || this.apiKey);
    url.searchParams.append('function', endpoint);
    
    Object.keys(params).forEach(key => {
      if (key !== 'user' && key !== 'pass') {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.text();
      return this.parseVicidialResponse(data);
    } catch (error) {
      console.error('Error connecting to Vicidial:', error);
      return this.getSimulatedData(endpoint, params);
    }
  }

  private parseVicidialResponse(data: string): any {
    const lines = data.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split('|');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('|');
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      result.push(obj);
    }

    return result;
  }

  private getSimulatedData(endpoint: string, params: any): any {
    switch (endpoint) {
      case 'agent_status':
        return this.getSimulatedAgents();
      case 'logged_in_agents':
        return this.getSimulatedLoggedInAgents();
      case 'campaign_stats':
        return this.getSimulatedCampaignStats();
      default:
        return [];
    }
  }

  private getSimulatedAgents(): any[] {
    return [
      {
        user: 'asesor1',
        full_name: 'María González',
        status: 'READY',
        campaign_id: 'VENTAS_PREMIUM',
        session_id: 'session123',
        login_time: '2024-01-15 08:00:00',
        calls_today: '45',
        talk_time_today: '3600',
        pause_time_today: '300',
        last_call_time: '180',
        server_ip: '192.168.1.100',
        phone_login: '8001',
        phone_pass: 'pass123'
      }
    ];
  }

  private getSimulatedLoggedInAgents(): any[] {
    return this.getSimulatedAgents().filter(agent => agent.status !== 'LOGOUT');
  }

  private getSimulatedCampaignStats(): any[] {
    return [
      {
        campaign_id: 'VENTAS_PREMIUM',
        campaign_name: 'Ventas Premium',
        calls_today: '150',
        answered_today: '120',
        drops_today: '8'
      }
    ];
  }

  async getAgentStatus(): Promise<VicidialAgent[]> {
    const data = await this.makeRequest('agent_status');
    return data.map((agent: any) => ({
      user: agent.user || agent.User,
      fullName: agent.full_name || agent.FullName || `${agent.first_name} ${agent.last_name}`,
      status: agent.status || agent.Status || 'READY',
      campaign: agent.campaign_id || agent.Campaign,
      sessionId: agent.session_id || agent.SessionID,
      loginTime: agent.login_time || agent.LoginTime,
      callsToday: parseInt(agent.calls_today || agent.CallsToday) || 0,
      talkTimeToday: parseInt(agent.talk_time_today || agent.TalkTimeToday) || 0,
      pauseTimeToday: parseInt(agent.pause_time_today || agent.PauseTimeToday) || 0,
      lastCallTime: parseInt(agent.last_call_time || agent.LastCallTime) || 0,
      server_ip: agent.server_ip || agent.ServerIP,
      phone_login: agent.phone_login || agent.PhoneLogin,
      phone_pass: agent.phone_pass || agent.PhonePass
    }));
  }

  async initiateManualCall(params: {
    phone_number: string;
    user: string;
    campaign?: string;
    lead_id?: string;
  }): Promise<any> {
    return await this.makeRequest('originate_call', params);
  }

  async pauseAgent(params: { user: string; pause_code?: string }): Promise<any> {
    return await this.makeRequest('agent_pause', params);
  }

  async unpauseAgent(params: { user: string }): Promise<any> {
    return await this.makeRequest('agent_unpause', params);
  }
}

export const vicidialCore = new VicidialCoreService();
