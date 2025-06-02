import { VicidialLead, VicidialAgent } from './vicidialService';

interface LocalDataStore {
  leads: any[];
  campaigns: any[];
  advisorMetrics: any[];
  qualityReviews: any[];
  leadClassifications: any[];
  followUpTasks: any[];
  agents: any[];
  promotions: any[];
  campaignOrigins: any[];
  contactHistory: any[];
  leadPromotions: any[];
  leadInteractions: any[];
}

class DataStoreService {
  private storageKey = 'ccd_crm_data';
  
  private getStoredData(): LocalDataStore {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    return this.getDefaultData();
  }

  private saveData(data: LocalDataStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getDefaultData(): LocalDataStore {
    return {
      leads: this.generateSampleLeads(),
      campaigns: this.generateSampleCampaigns(),
      advisorMetrics: this.generateSampleAdvisorMetrics(),
      qualityReviews: [],
      leadClassifications: [],
      followUpTasks: [],
      agents: this.generateSampleAgents(),
      promotions: this.generateSamplePromotions(),
      campaignOrigins: this.generateSampleCampaignOrigins(),
      contactHistory: [],
      leadPromotions: this.generateSampleLeadPromotions(),
      leadInteractions: this.generateSampleLeadInteractions()
    };
  }

  // Leads management
  getLeads(filters: any = {}): any[] {
    const data = this.getStoredData();
    let leads = data.leads;

    if (filters.status && filters.status !== 'all') {
      leads = leads.filter((lead: any) => lead.status === filters.status);
    }

    if (filters.source) {
      leads = leads.filter((lead: any) => lead.source === filters.source);
    }

    if (filters.campaignCode) {
      leads = leads.filter((lead: any) => lead.campaignOriginCode === filters.campaignCode);
    }

    if (filters.isActive && filters.isActive !== 'all') {
      const isActive = filters.isActive === 'true';
      leads = leads.filter((lead: any) => lead.isActive === isActive);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      leads = leads.filter((lead: any) => 
        lead.firstName?.toLowerCase().includes(search) ||
        lead.lastName?.toLowerCase().includes(search) ||
        lead.phoneNumber?.includes(search) ||
        lead.email?.toLowerCase().includes(search)
      );
    }

    return leads;
  }

  // Lead Promotions management
  getLeadPromotions(): any[] {
    const data = this.getStoredData();
    return data.leadPromotions || [];
  }

  addLeadPromotion(promotion: any): void {
    const data = this.getStoredData();
    if (!data.leadPromotions) data.leadPromotions = [];
    data.leadPromotions.push(promotion);
    this.saveData(data);
  }

  updateLeadPromotion(promotionId: string, updates: any): void {
    const data = this.getStoredData();
    if (!data.leadPromotions) return;
    
    const index = data.leadPromotions.findIndex((promo: any) => promo.id === promotionId);
    if (index !== -1) {
      data.leadPromotions[index] = { ...data.leadPromotions[index], ...updates };
      this.saveData(data);
    }
  }

  // Lead Interactions management
  getLeadInteractions(): any[] {
    const data = this.getStoredData();
    return data.leadInteractions || [];
  }

  addLeadInteraction(interaction: any): void {
    const data = this.getStoredData();
    if (!data.leadInteractions) data.leadInteractions = [];
    data.leadInteractions.push(interaction);
    this.saveData(data);
  }

  // Campaign Profitability
  getCampaignProfitability(): any[] {
    const data = this.getStoredData();
    const leads = data.leads;
    
    const campaignStats = leads.reduce((acc: any, lead: any) => {
      const code = lead.campaignOriginCode || 'UNKNOWN';
      if (!acc[code]) {
        acc[code] = {
          campaignCode: code,
          campaignName: `Campaña ${code}`,
          totalInvestment: 0,
          leadsGenerated: 0,
          activatedLeads: 0,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[code].leadsGenerated++;
      if (lead.isActive) acc[code].activatedLeads++;
      if (lead.status === 'SALE') acc[code].conversions++;
      
      return acc;
    }, {});

    return Object.values(campaignStats);
  }

  addLead(leadData: any): void {
    const data = this.getStoredData();
    const newLead = {
      id: `lead_${Date.now()}`,
      entryDate: new Date().toISOString(),
      callCount: 0,
      score: 50,
      isActive: false,
      campaignOriginCode: leadData.campaignOriginCode || leadData.source || 'UNKNOWN',
      ...leadData
    };
    
    data.leads.push(newLead);
    this.saveData(data);
  }

  updateLead(id: string, updates: any): void {
    const data = this.getStoredData();
    const index = data.leads.findIndex((lead: any) => lead.id === id);
    
    if (index !== -1) {
      data.leads[index] = { ...data.leads[index], ...updates };
      this.saveData(data);
    }
  }

  getCampaigns(): any[] {
    const data = this.getStoredData();
    return data.campaigns;
  }

  addCampaign(campaignData: any): void {
    const data = this.getStoredData();
    const newCampaign = {
      id: `campaign_${Date.now()}`,
      ...campaignData
    };
    
    data.campaigns.push(newCampaign);
    this.saveData(data);
  }

  updateCampaign(id: string, updates: any): void {
    const data = this.getStoredData();
    const index = data.campaigns.findIndex((campaign: any) => campaign.id === id);
    
    if (index !== -1) {
      data.campaigns[index] = { ...data.campaigns[index], ...updates };
      this.saveData(data);
    }
  }

  getAdvisorMetrics(): any[] {
    const data = this.getStoredData();
    return data.advisorMetrics;
  }

  updateAdvisorStatus(advisorId: string, status: string): void {
    const data = this.getStoredData();
    const index = data.advisorMetrics.findIndex((advisor: any) => advisor.id === advisorId);
    
    if (index !== -1) {
      data.advisorMetrics[index].status = status;
      data.advisorMetrics[index].lastActivity = new Date().toISOString();
      this.saveData(data);
    }
  }

  getQualityReviews(): any[] {
    const data = this.getStoredData();
    return data.qualityReviews;
  }

  addQualityReview(reviewData: any): void {
    const data = this.getStoredData();
    const newReview = {
      id: `review_${Date.now()}`,
      date: new Date().toISOString(),
      ...reviewData
    };
    
    data.qualityReviews.push(newReview);
    this.saveData(data);
  }

  getLeadClassifications(): any[] {
    const data = this.getStoredData();
    return data.leadClassifications;
  }

  updateLeadClassification(leadId: string, classification: any): void {
    const data = this.getStoredData();
    const index = data.leadClassifications.findIndex((c: any) => c.leadId === leadId);
    
    if (index !== -1) {
      data.leadClassifications[index] = { ...data.leadClassifications[index], ...classification };
    } else {
      data.leadClassifications.push({
        id: `classification_${Date.now()}`,
        leadId,
        createdAt: new Date().toISOString(),
        ...classification
      });
    }
    
    this.saveData(data);
  }

  addLeadObservation(leadId: string, observation: any): void {
    const data = this.getStoredData();
    const classification = data.leadClassifications.find((c: any) => c.leadId === leadId);
    
    if (classification) {
      if (!classification.observations) {
        classification.observations = [];
      }
      classification.observations.push(observation);
      this.saveData(data);
    }
  }

  applyPromotion(leadId: string, promotionId: string): void {
    const data = this.getStoredData();
    const classification = data.leadClassifications.find((c: any) => c.leadId === leadId);
    
    if (classification && classification.promotions) {
      const promotion = classification.promotions.find((p: any) => p.id === promotionId);
      if (promotion) {
        promotion.applied = true;
        promotion.appliedDate = new Date().toISOString();
        promotion.status = 'APPLIED';
        this.saveData(data);
      }
    }
  }

  getFollowUpTasks(): any[] {
    const data = this.getStoredData();
    return data.followUpTasks;
  }

  addFollowUpTask(task: any): void {
    const data = this.getStoredData();
    data.followUpTasks.push(task);
    this.saveData(data);
  }

  getAgents(): any[] {
    const data = this.getStoredData();
    return data.agents;
  }

  // Sample data generators
  private generateSampleLeads(): any[] {
    return [
      {
        id: 'lead_001',
        vendorLeadCode: 'FB_VIDA_2024_001',
        firstName: 'Juan',
        lastName: 'Pérez',
        phoneNumber: '3001234567',
        email: 'juan.perez@email.com',
        status: 'CALLBACK',
        source: 'FACEBOOK',
        entryDate: '2024-01-15T10:30:00Z',
        lastCallDate: '2024-01-15',
        callCount: 2,
        comments: 'Interesado en seguro de vida, tiene 2 hijos menores',
        priority: 8,
        score: 85,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'FB_VIDA_2024',
        isActive: true,
        activationDate: '2024-01-15T11:00:00Z',
        activatedBy: 'asesor1'
      },
      {
        id: 'lead_002',
        vendorLeadCode: 'GOOG_AUTO_2024_001',
        firstName: 'María',
        lastName: 'García',
        phoneNumber: '3109876543',
        email: 'maria.garcia@email.com',
        status: 'NEW',
        source: 'GOOGLE',
        entryDate: '2024-01-16T09:15:00Z',
        callCount: 0,
        comments: 'Busca seguro para vehículo nuevo',
        priority: 6,
        score: 65,
        assignedAgent: 'asesor2',
        campaignOriginCode: 'GOOG_AUTO_2024',
        isActive: false
      },
      {
        id: 'lead_003',
        vendorLeadCode: 'TIK_VIDA_2024_001',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        phoneNumber: '3157894561',
        email: 'carlos.rodriguez@email.com',
        status: 'SALE',
        source: 'TIKTOK',
        entryDate: '2024-01-14T14:20:00Z',
        callCount: 5,
        comments: 'Cerró venta de seguro de vida premium',
        priority: 9,
        score: 95,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'TIK_VIDA_2024',
        isActive: true,
        activationDate: '2024-01-14T15:00:00Z',
        activatedBy: 'asesor1'
      }
    ];
  }

  private generateSampleLeadPromotions(): any[] {
    return [
      {
        id: 'promo_001',
        leadId: 'lead_001',
        phoneNumber: '3001234567',
        promotionId: 'PROM001',
        promotionName: 'Seguro de Vida 50% Descuento',
        interestLevel: 8,
        status: 'INTERESTED',
        dateShown: '2024-01-15T10:45:00Z',
        notes: 'Muy interesado, tiene familia joven',
        followUpRequired: true,
        nextFollowUpDate: '2024-01-18T10:00:00Z'
      },
      {
        id: 'promo_002',
        leadId: 'lead_001',
        phoneNumber: '3001234567',
        promotionId: 'PROM002',
        promotionName: 'Seguro Hogar + Auto Combo',
        interestLevel: 6,
        status: 'PRESENTED',
        dateShown: '2024-01-15T11:15:00Z',
        notes: 'Interés moderado, necesita consultar con esposa',
        followUpRequired: true,
        nextFollowUpDate: '2024-01-20T14:00:00Z'
      },
      {
        id: 'promo_003',
        leadId: 'lead_003',
        phoneNumber: '3157894561',
        promotionId: 'PROM001',
        promotionName: 'Seguro de Vida 50% Descuento',
        interestLevel: 10,
        status: 'ACCEPTED',
        dateShown: '2024-01-14T14:30:00Z',
        responseDate: '2024-01-14T15:30:00Z',
        notes: 'Aceptó la promoción - VENTA CERRADA',
        followUpRequired: false
      }
    ];
  }

  private generateSampleLeadInteractions(): any[] {
    return [
      {
        id: 'interaction_001',
        leadId: 'lead_001',
        phoneNumber: '3001234567',
        advisorId: 'asesor1',
        interactionType: 'CALL',
        date: '2024-01-15T10:30:00Z',
        duration: 450,
        outcome: 'CONTACT_MADE',
        notes: 'Primera llamada exitosa, cliente muy receptivo',
        promotionsDiscussed: ['PROM001', 'PROM002'],
        nextAction: 'Enviar cotización por WhatsApp',
        nextActionDate: '2024-01-15T16:00:00Z'
      },
      {
        id: 'interaction_002',
        leadId: 'lead_001',
        phoneNumber: '3001234567',
        advisorId: 'asesor1',
        interactionType: 'WHATSAPP',
        date: '2024-01-15T16:00:00Z',
        duration: 0,
        outcome: 'CONTACT_MADE',
        notes: 'Envió cotización detallada por WhatsApp',
        promotionsDiscussed: ['PROM001'],
        nextAction: 'Llamada de seguimiento',
        nextActionDate: '2024-01-18T10:00:00Z'
      },
      {
        id: 'interaction_003',
        leadId: 'lead_003',
        phoneNumber: '3157894561',
        advisorId: 'asesor1',
        interactionType: 'CALL',
        date: '2024-01-14T14:20:00Z',
        duration: 780,
        outcome: 'SALE',
        notes: 'Llamada de cierre exitosa - Venta concretada',
        promotionsDiscussed: ['PROM001'],
        nextAction: 'Enviar documentos para firma',
        nextActionDate: '2024-01-15T09:00:00Z'
      }
    ];
  }

  private generateSampleCampaigns(): any[] {
    return [
      {
        id: 'campaign_001',
        name: 'Ventas Premium',
        description: 'Campaña de seguros premium',
        status: 'ACTIVE',
        listId: '101',
        dialMethod: 'RATIO',
        maxRatio: 2.5,
        totalLeads: 1500,
        contactedLeads: 850,
        successfulCalls: 125,
        startDate: '2024-01-01',
        agentsAssigned: 8,
        priority: 1,
        conversionRate: 14.7
      }
    ];
  }

  private generateSampleAdvisorMetrics(): any[] {
    return [
      {
        id: 'asesor1',
        name: 'María González',
        email: 'maria.gonzalez@ccd.com',
        status: 'ACTIVE',
        campaign: 'Ventas Premium',
        shift: '08:00-17:00',
        callsToday: 45,
        callsWeek: 220,
        callsMonth: 950,
        avgCallDuration: 280,
        totalCallTime: 12600,
        contactsToday: 28,
        appointmentsToday: 8,
        salesToday: 3,
        conversionRate: 10.7,
        appointmentRate: 28.6,
        qualityScore: 87,
        customerSatisfaction: 4.2,
        scriptCompliance: 92,
        objectionHandling: 85,
        leadsAssigned: 75,
        leadsContacted: 65,
        leadsConverted: 7,
        avgResponseTime: 45,
        followUpRate: 89,
        loginTime: '08:00:00',
        breakTime: 1800,
        productiveTime: 25200,
        idleTime: 900,
        lastActivity: new Date().toISOString(),
        ranking: 3
      },
      {
        id: 'asesor2',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@ccd.com',
        status: 'ACTIVE',
        campaign: 'Ventas Premium',
        shift: '09:00-18:00',
        callsToday: 38,
        callsWeek: 185,
        callsMonth: 820,
        avgCallDuration: 245,
        totalCallTime: 9310,
        contactsToday: 22,
        appointmentsToday: 5,
        salesToday: 2,
        conversionRate: 9.1,
        appointmentRate: 22.7,
        qualityScore: 78,
        customerSatisfaction: 3.8,
        scriptCompliance: 88,
        objectionHandling: 75,
        leadsAssigned: 68,
        leadsContacted: 58,
        leadsConverted: 5,
        avgResponseTime: 52,
        followUpRate: 76,
        loginTime: '09:00:00',
        breakTime: 2100,
        productiveTime: 23400,
        idleTime: 1500,
        lastActivity: new Date().toISOString(),
        ranking: 7
      }
    ];
  }

  private generateSampleAgents(): any[] {
    return [
      {
        user: 'asesor1',
        fullName: 'María González',
        status: 'READY',
        campaignId: 'VENTAS_PREMIUM',
        callsToday: 45,
        salesToday: 3,
        avgCallTime: 280
      },
      {
        user: 'asesor2',
        fullName: 'Carlos Rodríguez',
        status: 'INCALL',
        campaignId: 'VENTAS_PREMIUM',
        callsToday: 38,
        salesToday: 2,
        avgCallTime: 245
      }
    ];
  }

  private generateSamplePromotions(): any[] {
    return [
      {
        id: 'PROM001',
        promotionCode: 'SEGURO_VIDA_50',
        promotionName: 'Seguro de Vida con 50% de Descuento',
        description: 'Seguro de vida con cobertura completa y 50% de descuento en la primera anualidad',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        validFrom: '2024-01-01',
        validUntil: '2024-06-30',
        targetAudience: ['adultos-jovenes', 'familias', 'profesionales'],
        requirements: 'Edad entre 25-45 años, ingresos mínimos $2,000,000',
        maxUsage: 1000,
        currentUsage: 245,
        status: 'ACTIVE'
      },
      {
        id: 'PROM002',
        promotionCode: 'COMBO_HOGAR_AUTO',
        promotionName: 'Combo Hogar + Auto',
        description: 'Seguro de hogar y auto con descuento por paquete',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        targetAudience: ['propietarios', 'familias'],
        requirements: 'Tener casa propia y vehículo',
        maxUsage: 500,
        currentUsage: 89,
        status: 'ACTIVE'
      }
    ];
  }

  private generateSampleCampaignOrigins(): any[] {
    return [
      {
        campaignCode: 'FB_VIDA_2024',
        campaignName: 'Facebook - Seguros de Vida 2024',
        source: 'FACEBOOK',
        medium: 'CPC',
        costPerLead: 15000,
        totalInvestment: 5000000,
        leadsGenerated: 333,
        conversions: 42,
        roi: 2.8,
        startDate: '2024-01-01',
        status: 'ACTIVE',
        targetAudience: {
          ageRange: '25-45',
          location: ['Bogotá', 'Medellín', 'Cali'],
          interests: ['seguros', 'familia', 'protección'],
          gender: 'ALL'
        }
      },
      {
        campaignCode: 'GOOG_AUTO_2024',
        campaignName: 'Google - Seguros de Auto 2024',
        source: 'GOOGLE',
        medium: 'CPC',
        costPerLead: 18000,
        totalInvestment: 3600000,
        leadsGenerated: 200,
        conversions: 28,
        roi: 2.1,
        startDate: '2024-01-01',
        status: 'ACTIVE',
        targetAudience: {
          ageRange: '25-55',
          location: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
          interests: ['autos', 'seguros', 'vehículos'],
          gender: 'ALL'
        }
      },
      {
        campaignCode: 'TIK_VIDA_2024',
        campaignName: 'TikTok - Seguros Jóvenes 2024',
        source: 'TIKTOK',
        medium: 'CPC',
        costPerLead: 12000,
        totalInvestment: 2400000,
        leadsGenerated: 200,
        conversions: 15,
        roi: 1.5,
        startDate: '2024-01-01',
        status: 'ACTIVE',
        targetAudience: {
          ageRange: '18-35',
          location: ['Bogotá', 'Medellín', 'Cali'],
          interests: ['seguros', 'protección', 'familia'],
          gender: 'ALL'
        }
      }
    ];
  }
}

export const dataStore = new DataStoreService();
