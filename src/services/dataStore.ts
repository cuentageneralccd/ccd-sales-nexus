// Store de datos local con persistencia
interface DataStore {
  leads: any[];
  campaigns: any[];
  agents: any[];
  calls: any[];
  templates: any[];
  financialData: any;
  settings: any;
  advisorMetrics: any[];
  leadClassifications: any[];
  qualityReviews: any[];
  followUpTasks: any[];
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
      },
      advisorMetrics: [],
      leadClassifications: [],
      qualityReviews: [],
      followUpTasks: []
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
    
    // Inicializar nuevos datos
    if (!this.data.advisorMetrics) {
      this.data.advisorMetrics = this.generateAdvisorMetrics();
    }
    if (!this.data.leadClassifications) {
      this.data.leadClassifications = this.generateLeadClassifications();
    }
    if (!this.data.qualityReviews) {
      this.data.qualityReviews = [];
    }
    if (!this.data.followUpTasks) {
      this.data.followUpTasks = this.generateFollowUpTasks();
    }
    
    this.saveToStorage();
  }

  private generateAdvisorMetrics(): any[] {
    const names = [
      'Carlos Mendoza', 'María González', 'Roberto Silva', 'Ana López', 'Jorge Ramírez',
      'Carmen Torres', 'Pedro Martín', 'Lucía Herrera', 'Diego Ruiz', 'Sofía Castro',
      'Andrés Morales', 'Gabriela Vega', 'Francisco Delgado', 'Valeria Ramos', 'Miguel Ángel Soto'
    ];
    
    const campaigns = ['Prospección Q2 2025', 'Seguimiento Clientes', 'Black Friday', 'Referidos VIP'];
    const shifts = ['Mañana (08:00-16:00)', 'Tarde (14:00-22:00)', 'Noche (20:00-04:00)'];
    const statuses = ['ACTIVE', 'BREAK', 'LUNCH', 'TRAINING', 'OFFLINE'];

    return Array.from({ length: 100 }, (_, i) => ({
      id: `advisor_${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length] + ` (${i + 1})`,
      email: `advisor${i + 1}@ccdcrm.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      shift: shifts[Math.floor(Math.random() * shifts.length)],
      
      // Métricas de llamadas
      callsToday: Math.floor(Math.random() * 80) + 20,
      callsWeek: Math.floor(Math.random() * 400) + 100,
      callsMonth: Math.floor(Math.random() * 1600) + 400,
      avgCallDuration: Math.floor(Math.random() * 300) + 180, // segundos
      totalCallTime: Math.floor(Math.random() * 28800) + 7200, // segundos
      
      // Métricas de conversión
      contactsToday: Math.floor(Math.random() * 60) + 15,
      appointmentsToday: Math.floor(Math.random() * 8) + 2,
      salesToday: Math.floor(Math.random() * 5) + 1,
      conversionRate: Math.round((Math.random() * 15 + 5) * 10) / 10,
      appointmentRate: Math.round((Math.random() * 20 + 10) * 10) / 10,
      
      // Métricas de calidad
      qualityScore: Math.round((Math.random() * 30 + 65) * 10) / 10,
      customerSatisfaction: Math.round((Math.random() * 20 + 75) * 10) / 10,
      scriptCompliance: Math.round((Math.random() * 25 + 70) * 10) / 10,
      objectionHandling: Math.round((Math.random() * 30 + 65) * 10) / 10,
      
      // Productividad
      leadsAssigned: Math.floor(Math.random() * 50) + 20,
      leadsContacted: Math.floor(Math.random() * 40) + 15,
      leadsConverted: Math.floor(Math.random() * 8) + 2,
      avgResponseTime: Math.floor(Math.random() * 300) + 60, // segundos
      followUpRate: Math.round((Math.random() * 20 + 75) * 10) / 10,
      
      // Horarios y asistencia
      loginTime: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000).toISOString(),
      breakTime: Math.floor(Math.random() * 1800) + 900, // segundos
      productiveTime: Math.floor(Math.random() * 25200) + 18000, // segundos
      idleTime: Math.floor(Math.random() * 3600) + 600, // segundos
      
      lastActivity: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      ranking: i + 1
    }));
  }

  private generateLeadClassifications(): any[] {
    const leadTypes = ['HOT', 'WARM', 'COLD', 'QUALIFIED', 'UNQUALIFIED'];
    const budgetRanges = ['LOW', 'MEDIUM', 'HIGH', 'PREMIUM'];
    const timelines = ['IMMEDIATE', 'WEEK', 'MONTH', 'QUARTER', 'LONG_TERM'];
    const authorities = ['DECISION_MAKER', 'INFLUENCER', 'USER', 'UNKNOWN'];
    const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'PRESENTATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

    return Array.from({ length: 75 }, (_, i) => ({
      id: `classification_${i + 1}`,
      leadId: `lead_${i + 1}`,
      advisorId: `advisor_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      
      leadType: leadTypes[Math.floor(Math.random() * leadTypes.length)],
      interest_level: Math.floor(Math.random() * 10) + 1,
      budget_range: budgetRanges[Math.floor(Math.random() * budgetRanges.length)],
      decision_timeline: timelines[Math.floor(Math.random() * timelines.length)],
      authority_level: authorities[Math.floor(Math.random() * authorities.length)],
      
      currentStage: stages[Math.floor(Math.random() * stages.length)],
      previousStages: [],
      stageHistory: [
        {
          stage: 'NEW',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          advisorId: `advisor_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
          duration: Math.floor(Math.random() * 1440), // minutos
          notes: 'Lead inicial recibido del sistema'
        }
      ],
      
      observations: this.generateObservations(i + 1),
      promotions: this.generatePromotions(i + 1),
      
      contactAttempts: Math.floor(Math.random() * 8) + 1,
      lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextContactDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      responseRate: Math.round((Math.random() * 40 + 40) * 10) / 10,
      engagementScore: Math.round((Math.random() * 50 + 30) * 10) / 10,
      
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  private generateObservations(leadIndex: number): any[] {
    const types = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const contents = [
      'Cliente interesado en el producto premium',
      'Solicitó información adicional sobre precios',
      'Reunión programada para la próxima semana',
      'Cliente con dudas sobre la implementación',
      'Seguimiento post-demo muy positivo',
      'Necesita aprobación del presupuesto',
      'Compartió información con el equipo',
      'Solicita referencias de otros clientes'
    ];

    const numObservations = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: numObservations }, (_, i) => ({
      id: `obs_${leadIndex}_${i + 1}`,
      date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      advisorId: `advisor_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      followUpDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      completed: Math.random() > 0.3
    }));
  }

  private generatePromotions(leadIndex: number): any[] {
    const promotions = [
      { name: 'Descuento Lanzamiento', description: 'Descuento especial por ser cliente nuevo', discount: 15 },
      { name: 'Black Friday', description: 'Oferta limitada de fin de año', discount: 25 },
      { name: 'Upgrade Gratuito', description: 'Upgrade sin costo adicional', discount: 10 },
      { name: 'Paquete Premium', description: 'Acceso completo por 3 meses', discount: 20 }
    ];

    if (Math.random() > 0.6) return []; // 40% de leads sin promociones

    const numPromotions = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: numPromotions }, (_, i) => {
      const promo = promotions[Math.floor(Math.random() * promotions.length)];
      return {
        id: `promo_${leadIndex}_${i + 1}`,
        ...promo,
        validUntil: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        applied: Math.random() > 0.7,
        appliedDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        status: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'][Math.floor(Math.random() * 4)]
      };
    });
  }

  private generateFollowUpTasks(): any[] {
    const types = ['CALL', 'EMAIL', 'MEETING', 'QUOTE', 'PRESENTATION'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    
    const titles = [
      'Llamada de seguimiento',
      'Enviar propuesta comercial',
      'Reunión de presentación',
      'Cotización personalizada',
      'Demo del producto',
      'Seguimiento post-reunión',
      'Aclarar dudas técnicas',
      'Negociación final'
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `task_${i + 1}`,
      leadId: `lead_${Math.floor(Math.random() * 75) + 1}`,
      advisorId: `advisor_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      description: 'Tarea generada automáticamente para seguimiento del lead',
      scheduledDate: new Date(Date.now() + (Math.random() - 0.5) * 14 * 24 * 60 * 60 * 1000).toISOString(),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      completedDate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      result: Math.random() > 0.7 ? 'Tarea completada exitosamente' : undefined,
      nextAction: Math.random() > 0.8 ? 'Programar siguiente seguimiento' : undefined
    }));
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

  // Métodos para advisor metrics
  getAdvisorMetrics(): any[] {
    return [...(this.data.advisorMetrics || [])];
  }

  updateAdvisorStatus(advisorId: string, status: string): void {
    const advisors = this.data.advisorMetrics || [];
    const index = advisors.findIndex(advisor => advisor.id === advisorId);
    if (index !== -1) {
      advisors[index].status = status;
      advisors[index].lastActivity = new Date().toISOString();
      this.saveToStorage();
    }
  }

  addQualityReview(review: any): void {
    if (!this.data.qualityReviews) {
      this.data.qualityReviews = [];
    }
    
    const newReview = {
      ...review,
      id: `review_${Date.now()}`,
      date: new Date().toISOString()
    };
    
    this.data.qualityReviews.unshift(newReview);
    this.saveToStorage();
  }

  getQualityReviews(): any[] {
    return [...(this.data.qualityReviews || [])];
  }

  // Métodos para lead classification
  getLeadClassifications(): any[] {
    return [...(this.data.leadClassifications || [])];
  }

  updateLeadClassification(leadId: string, updates: any): void {
    const classifications = this.data.leadClassifications || [];
    const index = classifications.findIndex(c => c.leadId === leadId);
    
    if (index !== -1) {
      classifications[index] = { ...classifications[index], ...updates, updatedAt: new Date().toISOString() };
    } else {
      // Crear nueva clasificación
      const newClassification = {
        id: `classification_${Date.now()}`,
        leadId,
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      classifications.push(newClassification);
    }
    
    this.saveToStorage();
  }

  addLeadObservation(leadId: string, observation: any): void {
    const classifications = this.data.leadClassifications || [];
    const index = classifications.findIndex(c => c.leadId === leadId);
    
    if (index !== -1) {
      if (!classifications[index].observations) {
        classifications[index].observations = [];
      }
      classifications[index].observations.push(observation);
      classifications[index].updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
  }

  applyPromotion(leadId: string, promotionId: string): void {
    const classifications = this.data.leadClassifications || [];
    const index = classifications.findIndex(c => c.leadId === leadId);
    
    if (index !== -1 && classifications[index].promotions) {
      const promoIndex = classifications[index].promotions.findIndex((p: any) => p.id === promotionId);
      if (promoIndex !== -1) {
        classifications[index].promotions[promoIndex].applied = true;
        classifications[index].promotions[promoIndex].appliedDate = new Date().toISOString();
        classifications[index].promotions[promoIndex].status = 'ACCEPTED';
        classifications[index].updatedAt = new Date().toISOString();
        this.saveToStorage();
      }
    }
  }

  // Métodos para follow-up tasks
  getFollowUpTasks(): any[] {
    return [...(this.data.followUpTasks || [])];
  }

  addFollowUpTask(task: any): void {
    if (!this.data.followUpTasks) {
      this.data.followUpTasks = [];
    }
    
    this.data.followUpTasks.unshift(task);
    this.saveToStorage();
  }

  updateFollowUpTask(taskId: string, updates: any): void {
    const tasks = this.data.followUpTasks || [];
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveToStorage();
    }
  }
}

export const dataStore = new LocalDataStore();
