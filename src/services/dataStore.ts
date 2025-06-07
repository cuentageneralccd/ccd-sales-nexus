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

interface LeadPromotion {
  id: string;
  leadId: string;
  phoneNumber: string;
  promotionId: string;
  promotionName: string;
  interestLevel: number;
  status: 'INTERESTED' | 'PRESENTED' | 'ACCEPTED' | 'REJECTED' | 'PENDING';
  dateShown: string;
  responseDate?: string;
  notes: string;
  followUpRequired: boolean;
  nextFollowUpDate?: string;
}

interface LeadInteraction {
  id: string;
  leadId: string;
  phoneNumber: string;
  advisorId: string;
  interactionType: 'CALL' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'MEETING';
  date: string;
  duration: number;
  outcome: 'CONTACT_MADE' | 'NO_ANSWER' | 'BUSY' | 'VOICEMAIL' | 'APPOINTMENT_SET' | 'SALE' | 'NOT_INTERESTED';
  notes: string;
  promotionsDiscussed: string[];
  nextAction?: string;
  nextActionDate?: string;
}

interface CampaignProfitability {
  campaignCode: string;
  campaignName: string;
  totalInvestment: number;
  leadsGenerated: number;
  activatedLeads: number;
  conversions: number;
  revenue: number;
  roi: number;
  costPerLead: number;
  costPerActivation: number;
  costPerConversion: number;
  profitability: number;
}

class DataStoreService {
  private leads: Lead[] = [];
  private leadPromotions: LeadPromotion[] = [];
  private leadInteractions: LeadInteraction[] = [];
  private campaignProfitability: CampaignProfitability[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedLeads = localStorage.getItem('leads');
    this.leads = storedLeads ? JSON.parse(storedLeads) : this.getDefaultLeads();

    const storedLeadPromotions = localStorage.getItem('leadPromotions');
    this.leadPromotions = storedLeadPromotions ? JSON.parse(storedLeadPromotions) : this.getDefaultLeadPromotions();

    const storedLeadInteractions = localStorage.getItem('leadInteractions');
    this.leadInteractions = storedLeadInteractions ? JSON.parse(storedLeadInteractions) : this.getDefaultLeadInteractions();

    const storedCampaignProfitability = localStorage.getItem('campaignProfitability');
    this.campaignProfitability = storedCampaignProfitability ? JSON.parse(storedCampaignProfitability) : this.getDefaultCampaignProfitability();
  }

  private saveToStorage(): void {
    localStorage.setItem('leads', JSON.stringify(this.leads));
    localStorage.setItem('leadPromotions', JSON.stringify(this.leadPromotions));
    localStorage.setItem('leadInteractions', JSON.stringify(this.leadInteractions));
    localStorage.setItem('campaignProfitability', JSON.stringify(this.campaignProfitability));
  }

  private getDefaultLeads(): Lead[] {
    return [
      {
        id: 'lead_1',
        vendorLeadCode: 'LC001',
        firstName: 'Ana',
        lastName: 'García',
        phoneNumber: '3001112222',
        email: 'ana.garcia@example.com',
        status: 'NEW',
        source: 'Meta Ads',
        entryDate: '2024-01-01',
        callCount: 0,
        comments: 'Interesada en plan familiar',
        priority: 7,
        score: 65,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'META01',
        isActive: false
      },
      {
        id: 'lead_2',
        vendorLeadCode: 'LC002',
        firstName: 'Carlos',
        lastName: 'Pérez',
        phoneNumber: '3102223333',
        email: 'carlos.perez@example.com',
        status: 'CONTACTED',
        source: 'Google Ads',
        entryDate: '2024-01-05',
        callCount: 1,
        comments: 'Preguntó por cobertura internacional',
        priority: 5,
        score: 78,
        assignedAgent: 'asesor2',
        campaignOriginCode: 'GOOGLE02',
        isActive: true,
        activationDate: '2024-01-06',
        activatedBy: 'asesor2'
      },
      {
        id: 'lead_3',
        vendorLeadCode: 'LC003',
        firstName: 'Luisa',
        lastName: 'Rodríguez',
        phoneNumber: '3203334444',
        email: 'luisa.rodriguez@example.com',
        status: 'CALLBACK',
        source: 'Referido',
        entryDate: '2024-01-10',
        lastCallDate: '2024-01-11',
        callCount: 2,
        comments: 'Agendar callback para el viernes',
        priority: 9,
        score: 82,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'REFERIDO03',
        isActive: false
      },
      {
        id: 'lead_4',
        vendorLeadCode: 'LC004',
        firstName: 'Pedro',
        lastName: 'Fernández',
        phoneNumber: '3014445555',
        email: 'pedro.fernandez@example.com',
        status: 'SALE',
        source: 'Website',
        entryDate: '2024-01-15',
        callCount: 3,
        comments: 'Cierre exitoso, póliza activada',
        priority: 6,
        score: 91,
        assignedAgent: 'asesor3',
        campaignOriginCode: 'WEB04',
        isActive: true,
        activationDate: '2024-01-16',
        activatedBy: 'asesor3'
      },
      {
        id: 'lead_5',
        vendorLeadCode: 'LC005',
        firstName: 'Sofía',
        lastName: 'Martínez',
        phoneNumber: '3115556666',
        email: 'sofia.martinez@example.com',
        status: 'NOT_INTERESTED',
        source: 'TikTok Ads',
        entryDate: '2024-01-20',
        callCount: 1,
        comments: 'No le interesa el seguro en este momento',
        priority: 3,
        score: 45,
        assignedAgent: 'asesor2',
        campaignOriginCode: 'TIKTOK05',
        isActive: false
      },
      {
        id: 'lead_6',
        vendorLeadCode: 'LC006',
        firstName: 'Diego',
        lastName: 'Sánchez',
        phoneNumber: '3216667777',
        email: 'diego.sanchez@example.com',
        status: 'NEW',
        source: 'Meta Ads',
        entryDate: '2024-01-25',
        callCount: 0,
        comments: 'Nuevo lead, contactar pronto',
        priority: 8,
        score: 70,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'META06',
        isActive: false
      },
      {
        id: 'lead_7',
        vendorLeadCode: 'LC007',
        firstName: 'Isabela',
        lastName: 'Ramírez',
        phoneNumber: '3027778888',
        email: 'isabela.ramirez@example.com',
        status: 'CONTACTED',
        source: 'Google Ads',
        entryDate: '2024-01-28',
        callCount: 2,
        comments: 'Enviada información por correo',
        priority: 4,
        score: 60,
        assignedAgent: 'asesor3',
        campaignOriginCode: 'GOOGLE07',
        isActive: true,
        activationDate: '2024-01-29',
        activatedBy: 'asesor3'
      },
      {
        id: 'lead_8',
        vendorLeadCode: 'LC008',
        firstName: 'Mateo',
        lastName: 'Vargas',
        phoneNumber: '3128889999',
        email: 'mateo.vargas@example.com',
        status: 'CALLBACK',
        source: 'Referido',
        entryDate: '2024-02-01',
        lastCallDate: '2024-02-02',
        callCount: 1,
        comments: 'Llamar después de las 3 PM',
        priority: 7,
        score: 75,
        assignedAgent: 'asesor2',
        campaignOriginCode: 'REFERIDO08',
        isActive: false
      },
      {
        id: 'lead_9',
        vendorLeadCode: 'LC009',
        firstName: 'Camila',
        lastName: 'Díaz',
        phoneNumber: '3229990000',
        email: 'camila.diaz@example.com',
        status: 'SALE',
        source: 'Website',
        entryDate: '2024-02-05',
        callCount: 4,
        comments: 'Aceptó la oferta, coordinar firma',
        priority: 8,
        score: 95,
        assignedAgent: 'asesor1',
        campaignOriginCode: 'WEB09',
        isActive: true,
        activationDate: '2024-02-06',
        activatedBy: 'asesor1'
      },
      {
        id: 'lead_10',
        vendorLeadCode: 'LC010',
        firstName: 'Samuel',
        lastName: 'Gómez',
        phoneNumber: '3030001111',
        email: 'samuel.gomez@example.com',
        status: 'NOT_INTERESTED',
        source: 'TikTok Ads',
        entryDate: '2024-02-10',
        callCount: 2,
        comments: 'Prefiere otra aseguradora',
        priority: 2,
        score: 30,
        assignedAgent: 'asesor3',
        campaignOriginCode: 'TIKTOK10',
        isActive: false
      }
    ];
  }

  private getDefaultLeadPromotions(): LeadPromotion[] {
    return [
      {
        id: 'promo_1',
        leadId: 'lead_1',
        phoneNumber: '3001112222',
        promotionId: 'promo123',
        promotionName: 'Descuento Familiar',
        interestLevel: 8,
        status: 'INTERESTED',
        dateShown: '2024-02-01',
        notes: 'Mostró interés en el descuento',
        followUpRequired: true,
        nextFollowUpDate: '2024-02-05'
      },
      {
        id: 'promo_2',
        leadId: 'lead_2',
        phoneNumber: '3102223333',
        promotionId: 'promo456',
        promotionName: 'Cobertura Internacional Plus',
        interestLevel: 6,
        status: 'PRESENTED',
        dateShown: '2024-02-03',
        responseDate: '2024-02-04',
        notes: 'En espera de respuesta',
        followUpRequired: true,
        nextFollowUpDate: '2024-02-07'
      },
      {
        id: 'promo_3',
        leadId: 'lead_3',
        phoneNumber: '3203334444',
        promotionId: 'promo789',
        promotionName: 'Beneficios Exclusivos Oro',
        interestLevel: 9,
        status: 'ACCEPTED',
        dateShown: '2024-02-05',
        responseDate: '2024-02-06',
        notes: 'Aceptó la promoción, coordinar activación',
        followUpRequired: false
      },
      {
        id: 'promo_4',
        leadId: 'lead_4',
        phoneNumber: '3014445555',
        promotionId: 'promo101',
        promotionName: 'Regalo por Activación Inmediata',
        interestLevel: 4,
        status: 'REJECTED',
        dateShown: '2024-02-07',
        responseDate: '2024-02-08',
        notes: 'No le interesó el regalo',
        followUpRequired: false
      },
      {
        id: 'promo_5',
        leadId: 'lead_5',
        phoneNumber: '3115556666',
        promotionId: 'promo202',
        promotionName: 'Plan de Lealtad Diamante',
        interestLevel: 7,
        status: 'PENDING',
        dateShown: '2024-02-09',
        notes: 'Enviada información detallada',
        followUpRequired: true,
        nextFollowUpDate: '2024-02-12'
      }
    ];
  }

  private getDefaultLeadInteractions(): LeadInteraction[] {
    return [
      {
        id: 'interaction_1',
        leadId: 'lead_1',
        phoneNumber: '3001112222',
        advisorId: 'asesor1',
        interactionType: 'CALL',
        date: '2024-02-01',
        duration: 180,
        outcome: 'CONTACT_MADE',
        notes: 'Se explicó el plan familiar',
        promotionsDiscussed: ['promo123'],
        nextAction: 'Enviar brochure',
        nextActionDate: '2024-02-02'
      },
      {
        id: 'interaction_2',
        leadId: 'lead_2',
        phoneNumber: '3102223333',
        advisorId: 'asesor2',
        interactionType: 'EMAIL',
        date: '2024-02-03',
        duration: 0,
        outcome: 'CONTACT_MADE',
        notes: 'Se envió información sobre cobertura internacional',
        promotionsDiscussed: ['promo456']
      },
      {
        id: 'interaction_3',
        leadId: 'lead_3',
        phoneNumber: '3203334444',
        advisorId: 'asesor1',
        interactionType: 'WHATSAPP',
        date: '2024-02-05',
        duration: 0,
        outcome: 'APPOINTMENT_SET',
        notes: 'Confirmado callback para el viernes',
        promotionsDiscussed: ['promo789'],
        nextAction: 'Preparar propuesta',
        nextActionDate: '2024-02-09'
      },
      {
        id: 'interaction_4',
        leadId: 'lead_4',
        phoneNumber: '3014445555',
        advisorId: 'asesor3',
        interactionType: 'MEETING',
        date: '2024-02-07',
        duration: 60,
        outcome: 'SALE',
        notes: 'Cierre exitoso, póliza activada',
        promotionsDiscussed: ['promo101']
      },
      {
        id: 'interaction_5',
        leadId: 'lead_5',
        phoneNumber: '3115556666',
        advisorId: 'asesor2',
        interactionType: 'SMS',
        date: '2024-02-09',
        duration: 0,
        outcome: 'NO_ANSWER',
        notes: 'Mensaje de seguimiento enviado',
        promotionsDiscussed: ['promo202'],
        nextAction: 'Llamar nuevamente',
        nextActionDate: '2024-02-12'
      }
    ];
  }

  private getDefaultCampaignProfitability(): CampaignProfitability[] {
    return [
      {
        campaignCode: 'META01',
        campaignName: 'Campaña Meta Ads Enero',
        totalInvestment: 5000000,
        leadsGenerated: 50,
        activatedLeads: 15,
        conversions: 5,
        revenue: 25000000,
        roi: 400,
        costPerLead: 100000,
        costPerActivation: 333333,
        costPerConversion: 1000000,
        profitability: 20000000
      },
      {
        campaignCode: 'GOOGLE02',
        campaignName: 'Campaña Google Ads Febrero',
        totalInvestment: 7500000,
        leadsGenerated: 75,
        activatedLeads: 25,
        conversions: 8,
        revenue: 40000000,
        roi: 433,
        costPerLead: 100000,
        costPerActivation: 300000,
        costPerConversion: 937500,
        profitability: 32500000
      }
    ];
  }

  getLeads(filters: any): Lead[] {
    let filteredLeads = [...this.leads];

    if (filters.status && filters.status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
    }

    if (filters.source) {
      filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm) ||
        lead.lastName.toLowerCase().includes(searchTerm) ||
        lead.phoneNumber.includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.campaignCode) {
      filteredLeads = filteredLeads.filter(lead => lead.campaignOriginCode === filters.campaignCode);
    }
    
    if (filters.isActive && filters.isActive !== 'all') {
      const isActive = filters.isActive === 'true';
      filteredLeads = filteredLeads.filter(lead => lead.isActive === isActive);
    }
    
    if (filters.hasPromotions && filters.hasPromotions !== 'all') {
      const hasPromotions = filters.hasPromotions === 'true';
      filteredLeads = filteredLeads.filter(lead => {
        const leadPromotions = this.leadPromotions.filter(promo => promo.leadId === lead.id);
        return hasPromotions ? leadPromotions.length > 0 : leadPromotions.length === 0;
      });
    }

    return filteredLeads;
  }

  getLeadPromotions(): LeadPromotion[] {
    return [...this.leadPromotions];
  }

  getLeadInteractions(): LeadInteraction[] {
    return [...this.leadInteractions];
  }

  getCampaignProfitability(): CampaignProfitability[] {
    return [...this.campaignProfitability];
  }

  addLead(leadData: Partial<Lead>): void {
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      vendorLeadCode: `LC${Date.now()}`,
      firstName: leadData.firstName || 'N/A',
      lastName: leadData.lastName || 'N/A',
      phoneNumber: leadData.phoneNumber || 'N/A',
      email: leadData.email || '',
      status: 'NEW',
      source: leadData.source || 'Manual',
      entryDate: new Date().toISOString().split('T')[0],
      callCount: 0,
      comments: leadData.comments || '',
      priority: leadData.priority || 5,
      score: 50,
      assignedAgent: 'N/A',
      campaignOriginCode: leadData.campaignOriginCode || 'UNKNOWN',
      isActive: false,
      activationDate: leadData.activationDate,
      activatedBy: leadData.activatedBy
    };
    this.leads.push(newLead);
    this.saveToStorage();
    console.log('Nuevo lead agregado:', newLead);
  }

  updateLead(id: string, updates: Partial<Lead>): void {
    this.leads = this.leads.map(lead => {
      if (lead.id === id) {
        return { ...lead, ...updates };
      }
      return lead;
    });
    this.saveToStorage();
    console.log(`Lead ${id} actualizado con:`, updates);
  }

  addLeadPromotion(promotionData: LeadPromotion): void {
    this.leadPromotions.push(promotionData);
    this.saveToStorage();
    console.log('Nueva promoción agregada:', promotionData);
  }

  updateLeadPromotion(promotionId: string, updates: Partial<LeadPromotion>): void {
    this.leadPromotions = this.leadPromotions.map(promotion => {
      if (promotion.id === promotionId) {
        return { ...promotion, ...updates };
      }
      return promotion;
    });
    this.saveToStorage();
    console.log(`Promoción ${promotionId} actualizada con:`, updates);
  }

  addLeadInteraction(interactionData: LeadInteraction): void {
    this.leadInteractions.push(interactionData);
    this.saveToStorage();
    console.log('Nueva interacción agregada:', interactionData);
  }

  deleteLead(leadId: string): void {
    this.leads = this.leads.filter(lead => lead.id !== leadId);
    this.saveToStorage();
    console.log(`Lead ${leadId} deleted from local storage`);
  }
}

export const dataStore = new DataStoreService();
