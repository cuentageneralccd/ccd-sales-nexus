
// Store de datos local con persistencia
interface DataStore {
  leads: any[];
  campaigns: any[];
  agents: any[];
  calls: any[];
  templates: any[];
  financialData: any;
  settings: any;
}

class LocalDataStore {
  private storageKey = 'ccd-crm-data';
  private data: DataStore;

  constructor() {
    this.data = this.loadFromStorage();
    this.initializeDefaultData();
  }

  private loadFromStorage(): DataStore {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getDefaultData(): DataStore {
    return {
      leads: [],
      campaigns: [],
      agents: [],
      calls: [],
      templates: [],
      financialData: {
        totalRevenue: 0,
        monthlyGrowth: 0,
        costPerLead: 0,
        roi: 0
      },
      settings: {
        autoAssignment: true,
        callRecording: true,
        smsNotifications: true
      }
    };
  }

  private initializeDefaultData(): void {
    if (this.data.leads.length === 0) {
      this.data.leads = this.generateSampleLeads();
    }
    if (this.data.campaigns.length === 0) {
      this.data.campaigns = this.generateSampleCampaigns();
    }
    if (this.data.agents.length === 0) {
      this.data.agents = this.generateSampleAgents();
    }
    this.saveToStorage();
  }

  private generateSampleLeads(): any[] {
    const sources = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Website', 'Referido'];
    const statuses = ['NEW', 'CONTACTED', 'CALLBACK', 'SALE', 'NOT_INTERESTED'];
    const firstNames = ['Roberto', 'Ana', 'Carlos', 'María', 'Jorge', 'Lucía', 'Pedro', 'Carmen'];
    const lastNames = ['Silva', 'Martínez', 'González', 'López', 'Rodríguez', 'Fernández'];

    return Array.from({ length: 150 }, (_, i) => ({
      id: `lead_${i + 1}`,
      vendorLeadCode: `CRM_${1000 + i}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      phoneNumber: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      email: `lead${i + 1}@example.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      entryDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastCallDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      callCount: Math.floor(Math.random() * 5),
      comments: `Lead generado desde ${sources[Math.floor(Math.random() * sources.length)]}`,
      priority: Math.floor(Math.random() * 10) + 1,
      score: Math.floor(Math.random() * 100),
      assignedAgent: `agent_${Math.floor(Math.random() * 5) + 1}`
    }));
  }

  private generateSampleCampaigns(): any[] {
    return [
      {
        id: 'camp_001',
        name: 'Prospección Q2 2025',
        description: 'Campaña principal de prospección',
        status: 'ACTIVE',
        listId: '1001',
        dialMethod: 'RATIO',
        maxRatio: 2.5,
        totalLeads: 2500,
        contactedLeads: 1250,
        successfulCalls: 375,
        startDate: '2025-05-01',
        agentsAssigned: 8,
        priority: 8,
        conversionRate: 15.2
      },
      {
        id: 'camp_002',
        name: 'Seguimiento Clientes',
        description: 'Campaña de seguimiento post-venta',
        status: 'ACTIVE',
        listId: '1002',
        dialMethod: 'MANUAL',
        maxRatio: 1.0,
        totalLeads: 800,
        contactedLeads: 600,
        successfulCalls: 180,
        startDate: '2025-05-15',
        agentsAssigned: 5,
        priority: 6,
        conversionRate: 22.5
      }
    ];
  }

  private generateSampleAgents(): any[] {
    return [
      {
        id: 'agent_001',
        name: 'Carlos Mendoza',
        status: 'READY',
        phone: 'SIP/1001',
        campaign: 'camp_001',
        callsToday: 45,
        salesToday: 3,
        avgCallTime: 320,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'agent_002',
        name: 'María González',
        status: 'INCALL',
        phone: 'SIP/1002',
        campaign: 'camp_001',
        callsToday: 38,
        salesToday: 5,
        avgCallTime: 285,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'agent_003',
        name: 'Roberto Silva',
        status: 'PAUSED',
        phone: 'SIP/1003',
        campaign: 'camp_002',
        callsToday: 22,
        salesToday: 2,
        avgCallTime: 410,
        lastActivity: new Date(Date.now() - 300000).toISOString()
      }
    ];
  }

  // Métodos públicos para acceso a datos
  getLeads(filters?: any): any[] {
    let leads = [...this.data.leads];
    
    if (filters?.status && filters.status !== 'all') {
      leads = leads.filter(lead => lead.status === filters.status);
    }
    
    if (filters?.source) {
      leads = leads.filter(lead => lead.source === filters.source);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      leads = leads.filter(lead => 
        lead.firstName.toLowerCase().includes(search) ||
        lead.lastName.toLowerCase().includes(search) ||
        lead.phoneNumber.includes(search) ||
        lead.email.toLowerCase().includes(search)
      );
    }
    
    return leads.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }

  addLead(lead: any): void {
    const newLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      vendorLeadCode: `CRM_${Date.now()}`,
      entryDate: new Date().toISOString().split('T')[0],
      callCount: 0,
      score: Math.floor(Math.random() * 100),
      assignedAgent: this.getAvailableAgent()
    };
    
    this.data.leads.unshift(newLead);
    this.saveToStorage();
  }

  updateLead(id: string, updates: any): void {
    const index = this.data.leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      this.data.leads[index] = { ...this.data.leads[index], ...updates };
      this.saveToStorage();
    }
  }

  getCampaigns(): any[] {
    return [...this.data.campaigns];
  }

  addCampaign(campaign: any): void {
    const newCampaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      totalLeads: 0,
      contactedLeads: 0,
      successfulCalls: 0,
      conversionRate: 0
    };
    
    this.data.campaigns.unshift(newCampaign);
    this.saveToStorage();
  }

  updateCampaign(id: string, updates: any): void {
    const index = this.data.campaigns.findIndex(campaign => campaign.id === id);
    if (index !== -1) {
      this.data.campaigns[index] = { ...this.data.campaigns[index], ...updates };
      this.saveToStorage();
    }
  }

  getAgents(): any[] {
    return [...this.data.agents];
  }

  getAvailableAgent(): string {
    const availableAgents = this.data.agents.filter(agent => 
      agent.status === 'READY' || agent.status === 'PAUSED'
    );
    
    if (availableAgents.length > 0) {
      return availableAgents[0].id;
    }
    
    return this.data.agents[0]?.id || 'agent_001';
  }

  getFinancialData(): any {
    return { ...this.data.financialData };
  }

  updateFinancialData(data: any): void {
    this.data.financialData = { ...this.data.financialData, ...data };
    this.saveToStorage();
  }
}

export const dataStore = new LocalDataStore();
