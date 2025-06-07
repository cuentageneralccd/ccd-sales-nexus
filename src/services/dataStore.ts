
// Local storage service for offline functionality
interface Lead {
  id: string;
  vendorLeadCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  status: string;
  source: string;
  entryDate: string;
  lastCallDate?: string;
  callCount: number;
  comments: string;
  priority: number;
  score: number;
  assignedAgent: string;
  campaignOriginCode: string;
  isActive: boolean;
  activationDate?: string;
  activatedBy?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';
  listId: string;
  dialMethod: 'MANUAL' | 'RATIO' | 'ADAPT_HARD_LIMIT';
  maxRatio: number;
  totalLeads: number;
  contactedLeads: number;
  successfulCalls: number;
  startDate: string;
  endDate?: string;
  agentsAssigned: number;
  priority: number;
  conversionRate: number;
}

interface AdvisorMetrics {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'BREAK' | 'LUNCH' | 'TRAINING' | 'OFFLINE';
  campaign: string;
  shift: string;
  callsToday: number;
  callsWeek: number;
  callsMonth: number;
  avgCallDuration: number;
  totalCallTime: number;
  contactsToday: number;
  appointmentsToday: number;
  salesToday: number;
  conversionRate: number;
  appointmentRate: number;
  qualityScore: number;
  customerSatisfaction: number;
  scriptCompliance: number;
  objectionHandling: number;
  leadsAssigned: number;
  leadsContacted: number;
  leadsConverted: number;
  avgResponseTime: number;
  followUpRate: number;
  loginTime: string;
  breakTime: number;
  productiveTime: number;
  idleTime: number;
  lastActivity: string;
  ranking: number;
}

interface QualityReview {
  id: string;
  advisorId: string;
  reviewerId: string;
  callId: string;
  date: string;
  scores: {
    greeting: number;
    productKnowledge: number;
    objectionHandling: number;
    closing: number;
    overall: number;
  };
  comments: string;
  recommendations: string[];
  status: 'PENDING' | 'REVIEWED' | 'DISPUTED';
}

interface LeadClassification {
  id: string;
  leadId: string;
  phoneNumber: string;
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  temperature: 'HOT' | 'WARM' | 'COLD';
  budget: number;
  authority: boolean;
  need: boolean;
  timeline: string;
  painPoints: string[];
  interests: string[];
  lastUpdated: string;
  notes: string;
}

interface LeadObservation {
  id: string;
  leadId: string;
  advisorId: string;
  date: string;
  type: 'BEHAVIOR' | 'INTEREST' | 'OBJECTION' | 'PREFERENCE';
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FollowUpTask {
  id: string;
  leadId: string;
  advisorId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'RESEARCH' | 'PROPOSAL';
  createdDate: string;
  completedDate?: string;
  result?: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ONLINE' | 'OFFLINE' | 'BREAK' | 'BUSY';
  campaigns: string[];
  skills: string[];
  shift: string;
  loginTime?: string;
  lastActivity?: string;
}

class DataStoreService {
  private getStorageKey(type: string): string {
    return `ccd_crm_${type}`;
  }

  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  // Leads methods
  getLeads(filters: any = {}): Lead[] {
    const leads = this.getFromStorage<Lead>('leads');
    return this.applyFilters(leads, filters);
  }

  addLead(lead: Partial<Lead>): Lead {
    const leads = this.getFromStorage<Lead>('leads');
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      vendorLeadCode: `VLC_${Date.now()}`,
      entryDate: new Date().toISOString().split('T')[0],
      callCount: 0,
      score: 50,
      assignedAgent: 'asesor1',
      campaignOriginCode: lead.source || 'UNKNOWN',
      isActive: false,
      status: 'NEW',
      priority: 5,
      comments: '',
      ...lead
    } as Lead;
    
    leads.push(newLead);
    this.saveToStorage('leads', leads);
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): void {
    const leads = this.getFromStorage<Lead>('leads');
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates };
      this.saveToStorage('leads', leads);
    }
  }

  deleteLead(id: string): void {
    const leads = this.getFromStorage<Lead>('leads');
    const filtered = leads.filter(lead => lead.id !== id);
    this.saveToStorage('leads', filtered);
  }

  // Lead Promotions methods
  getLeadPromotions(): any[] {
    return this.getFromStorage('lead_promotions');
  }

  addLeadPromotion(promotion: any): void {
    const promotions = this.getFromStorage('lead_promotions');
    promotions.push(promotion);
    this.saveToStorage('lead_promotions', promotions);
  }

  updateLeadPromotion(id: string, updates: any): void {
    const promotions = this.getFromStorage('lead_promotions');
    const index = promotions.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      promotions[index] = { ...promotions[index], ...updates };
      this.saveToStorage('lead_promotions', promotions);
    }
  }

  // Lead Interactions methods
  getLeadInteractions(): any[] {
    return this.getFromStorage('lead_interactions');
  }

  addLeadInteraction(interaction: any): void {
    const interactions = this.getFromStorage('lead_interactions');
    interactions.push(interaction);
    this.saveToStorage('lead_interactions', interactions);
  }

  // Campaigns methods
  getCampaigns(): Campaign[] {
    return this.getFromStorage<Campaign>('campaigns');
  }

  addCampaign(campaign: Partial<Campaign>): Campaign {
    const campaigns = this.getFromStorage<Campaign>('campaigns');
    const newCampaign: Campaign = {
      id: `campaign_${Date.now()}`,
      status: 'DRAFT',
      totalLeads: 0,
      contactedLeads: 0,
      successfulCalls: 0,
      agentsAssigned: 0,
      priority: 5,
      conversionRate: 0,
      startDate: new Date().toISOString().split('T')[0],
      dialMethod: 'MANUAL',
      maxRatio: 1,
      listId: `list_${Date.now()}`,
      ...campaign
    } as Campaign;
    
    campaigns.push(newCampaign);
    this.saveToStorage('campaigns', campaigns);
    return newCampaign;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): void {
    const campaigns = this.getFromStorage<Campaign>('campaigns');
    const index = campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...updates };
      this.saveToStorage('campaigns', campaigns);
    }
  }

  // Advisor Performance methods
  getAdvisorMetrics(): AdvisorMetrics[] {
    return this.getFromStorage<AdvisorMetrics>('advisor_metrics');
  }

  updateAdvisorStatus(advisorId: string, status: AdvisorMetrics['status']): void {
    const advisors = this.getFromStorage<AdvisorMetrics>('advisor_metrics');
    const index = advisors.findIndex(a => a.id === advisorId);
    if (index !== -1) {
      advisors[index].status = status;
      advisors[index].lastActivity = new Date().toISOString();
      this.saveToStorage('advisor_metrics', advisors);
    }
  }

  // Quality Reviews methods
  getQualityReviews(): QualityReview[] {
    return this.getFromStorage<QualityReview>('quality_reviews');
  }

  addQualityReview(review: Partial<QualityReview>): void {
    const reviews = this.getFromStorage<QualityReview>('quality_reviews');
    const newReview: QualityReview = {
      id: `review_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'PENDING',
      scores: {
        greeting: 0,
        productKnowledge: 0,
        objectionHandling: 0,
        closing: 0,
        overall: 0
      },
      comments: '',
      recommendations: [],
      ...review
    } as QualityReview;
    
    reviews.push(newReview);
    this.saveToStorage('quality_reviews', reviews);
  }

  // Lead Classification methods
  getLeadClassifications(): LeadClassification[] {
    return this.getFromStorage<LeadClassification>('lead_classifications');
  }

  updateLeadClassification(leadId: string, classification: Partial<LeadClassification>): void {
    const classifications = this.getFromStorage<LeadClassification>('lead_classifications');
    const index = classifications.findIndex(c => c.leadId === leadId);
    
    if (index !== -1) {
      classifications[index] = { ...classifications[index], ...classification };
    } else {
      const newClassification: LeadClassification = {
        id: `classification_${Date.now()}`,
        leadId,
        phoneNumber: '',
        stage: 'PROSPECT',
        temperature: 'WARM',
        budget: 0,
        authority: false,
        need: false,
        timeline: '',
        painPoints: [],
        interests: [],
        lastUpdated: new Date().toISOString(),
        notes: '',
        ...classification
      } as LeadClassification;
      classifications.push(newClassification);
    }
    
    this.saveToStorage('lead_classifications', classifications);
  }

  addLeadObservation(observation: Partial<LeadObservation>): void {
    const observations = this.getFromStorage<LeadObservation>('lead_observations');
    const newObservation: LeadObservation = {
      id: `observation_${Date.now()}`,
      date: new Date().toISOString(),
      type: 'BEHAVIOR',
      impact: 'MEDIUM',
      ...observation
    } as LeadObservation;
    
    observations.push(newObservation);
    this.saveToStorage('lead_observations', observations);
  }

  applyPromotion(leadId: string, promotionId: string): void {
    // Implementation for applying promotions
    console.log(`Applying promotion ${promotionId} to lead ${leadId}`);
  }

  // Follow-up Tasks methods
  getFollowUpTasks(): FollowUpTask[] {
    return this.getFromStorage<FollowUpTask>('follow_up_tasks');
  }

  addFollowUpTask(task: Partial<FollowUpTask>): void {
    const tasks = this.getFromStorage<FollowUpTask>('follow_up_tasks');
    const newTask: FollowUpTask = {
      id: `task_${Date.now()}`,
      title: '',
      description: '',
      dueDate: new Date().toISOString(),
      priority: 'MEDIUM',
      status: 'PENDING',
      type: 'CALL',
      createdDate: new Date().toISOString(),
      ...task
    } as FollowUpTask;
    
    tasks.push(newTask);
    this.saveToStorage('follow_up_tasks', tasks);
  }

  // Agents methods
  getAgents(): Agent[] {
    return this.getFromStorage<Agent>('agents');
  }

  private applyFilters(data: any[], filters: any): any[] {
    return data.filter(item => {
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      if (filters.source && item.source !== filters.source) {
        return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = ['firstName', 'lastName', 'phoneNumber', 'email'];
        const matches = searchFields.some(field => 
          item[field]?.toLowerCase().includes(searchTerm)
        );
        if (!matches) return false;
      }
      return true;
    });
  }

  // Initialize with sample data if empty
  initializeSampleData(): void {
    if (this.getLeads().length === 0) {
      this.generateSampleLeads();
    }
    if (this.getAdvisorMetrics().length === 0) {
      this.generateSampleAdvisors();
    }
    if (this.getCampaigns().length === 0) {
      this.generateSampleCampaigns();
    }
  }

  private generateSampleLeads(): void {
    const sampleLeads = [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        phoneNumber: '3001234567',
        email: 'juan.perez@email.com',
        source: 'Meta Ads',
        priority: 8,
        comments: 'Muy interesado en seguros de vida'
      },
      {
        firstName: 'María',
        lastName: 'González',
        phoneNumber: '3109876543',
        email: 'maria.gonzalez@email.com',
        source: 'Google Ads',
        priority: 6,
        comments: 'Solicitó información sobre seguros de hogar'
      }
    ];

    sampleLeads.forEach(lead => this.addLead(lead));
  }

  private generateSampleAdvisors(): void {
    const sampleAdvisors: AdvisorMetrics[] = [
      {
        id: 'asesor1',
        name: 'Carlos Rodríguez',
        email: 'carlos@empresa.com',
        status: 'ACTIVE',
        campaign: 'VENTAS_PREMIUM',
        shift: 'MAÑANA',
        callsToday: 45,
        callsWeek: 200,
        callsMonth: 850,
        avgCallDuration: 280,
        totalCallTime: 12600,
        contactsToday: 32,
        appointmentsToday: 8,
        salesToday: 3,
        conversionRate: 9.4,
        appointmentRate: 25.0,
        qualityScore: 87,
        customerSatisfaction: 4.2,
        scriptCompliance: 92,
        objectionHandling: 85,
        leadsAssigned: 150,
        leadsContacted: 120,
        leadsConverted: 15,
        avgResponseTime: 45,
        followUpRate: 88,
        loginTime: '08:00:00',
        breakTime: 30,
        productiveTime: 420,
        idleTime: 15,
        lastActivity: new Date().toISOString(),
        ranking: 2
      }
    ];

    this.saveToStorage('advisor_metrics', sampleAdvisors);
  }

  private generateSampleCampaigns(): void {
    const sampleCampaigns: Campaign[] = [
      {
        id: 'campaign1',
        name: 'Ventas Premium Q1',
        description: 'Campaña de seguros premium para Q1 2024',
        status: 'ACTIVE',
        listId: 'list_001',
        dialMethod: 'RATIO',
        maxRatio: 2.5,
        totalLeads: 1500,
        contactedLeads: 850,
        successfulCalls: 120,
        startDate: '2024-01-15',
        agentsAssigned: 8,
        priority: 8,
        conversionRate: 14.1
      }
    ];

    this.saveToStorage('campaigns', sampleCampaigns);
  }
}

export const dataStore = new DataStoreService();
