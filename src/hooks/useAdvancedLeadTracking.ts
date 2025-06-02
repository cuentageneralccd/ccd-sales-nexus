
import { useState, useEffect } from 'react';
import { vicidialService, VicidialLead } from '@/services/vicidialService';
import { useToast } from '@/hooks/use-toast';

interface LeadPromotion {
  id: string;
  promotionCode: string;
  promotionName: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_MONTHS';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  targetAudience: string[];
  requirements: string;
  maxUsage?: number;
  currentUsage: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'INACTIVE';
}

interface LeadInterest {
  id: string;
  leadId: string;
  phoneNumber: string;
  promotionId: string;
  interestLevel: 1 | 2 | 3 | 4 | 5; // 1=muy bajo, 5=muy alto
  capturedDate: string;
  capturedBy: string;
  source: 'CALL' | 'FORM' | 'CHAT' | 'EMAIL' | 'SMS';
  notes: string;
  followUpDate?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
}

interface CampaignOrigin {
  campaignCode: string;
  campaignName: string;
  source: 'FACEBOOK' | 'GOOGLE' | 'INSTAGRAM' | 'WHATSAPP' | 'REFERRAL' | 'COLD_CALL' | 'EMAIL' | 'SMS' | 'LANDING_PAGE';
  medium: 'CPC' | 'CPM' | 'ORGANIC' | 'SOCIAL' | 'EMAIL' | 'DIRECT' | 'REFERRAL';
  costPerLead: number;
  totalInvestment: number;
  leadsGenerated: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  targetAudience: {
    ageRange: string;
    location: string[];
    interests: string[];
    gender?: 'M' | 'F' | 'ALL';
  };
}

interface AdvancedLead extends VicidialLead {
  campaignOrigin: CampaignOrigin;
  promotionInterests: LeadInterest[];
  currentPromotion?: LeadPromotion;
  leadScore: number;
  qualificationStatus: 'UNQUALIFIED' | 'QUALIFIED' | 'HOT' | 'COLD' | 'NURTURING';
  lastContactAttempt: string;
  nextContactDate: string;
  assignedAgent: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  conversionProbability: number;
  estimatedValue: number;
  actualValue?: number;
  conversionDate?: string;
  lossReason?: string;
  contactHistory: ContactHistoryEntry[];
  customFields: Record<string, any>;
}

interface ContactHistoryEntry {
  id: string;
  timestamp: string;
  type: 'CALL' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'FORM_SUBMISSION' | 'CHAT';
  direction: 'INBOUND' | 'OUTBOUND';
  duration?: number; // para llamadas, en segundos
  status: 'COMPLETED' | 'NO_ANSWER' | 'BUSY' | 'FAILED' | 'CALLBACK_SCHEDULED' | 'INTERESTED' | 'NOT_INTERESTED';
  agentId: string;
  agentName: string;
  summary: string;
  promotionDiscussed?: string;
  objections?: string[];
  nextAction?: string;
  nextActionDate?: string;
  recording?: string; // URL de grabación si existe
  emailSubject?: string; // para emails
  templateUsed?: string;
  attachments?: string[];
  outcome: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'CALLBACK_REQUIRED' | 'DECISION_PENDING';
  qualityScore?: number; // 1-10
  customerSatisfaction?: number; // 1-10
}

export const useAdvancedLeadTracking = () => {
  const [leads, setLeads] = useState<AdvancedLead[]>([]);
  const [promotions, setPromotions] = useState<LeadPromotion[]>([]);
  const [campaignOrigins, setCampaignOrigins] = useState<CampaignOrigin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    phoneNumber: '',
    campaignCode: '',
    promotionId: '',
    status: '',
    priority: '',
    dateRange: { start: '', end: '' },
    agent: '',
    qualificationStatus: '',
    minScore: 0,
    maxScore: 100
  });
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadLeadsFromVicidial(),
        loadPromotions(),
        loadCampaignOrigins()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      loadSimulatedData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeadsFromVicidial = async () => {
    try {
      const vicidialLeads = await vicidialService.searchLeads({
        records: 1000
      });

      const enhancedLeads: AdvancedLead[] = vicidialLeads.map(lead => ({
        ...lead,
        campaignOrigin: getCampaignOriginByCode(lead.vendor_lead_code),
        promotionInterests: getPromotionInterestsByPhone(lead.phone_number),
        leadScore: calculateLeadScore(lead),
        qualificationStatus: determineQualificationStatus(lead),
        lastContactAttempt: lead.last_local_call_time,
        nextContactDate: calculateNextContactDate(lead),
        assignedAgent: lead.user || lead.owner,
        priority: determinePriority(lead),
        conversionProbability: calculateConversionProbability(lead),
        estimatedValue: calculateEstimatedValue(lead),
        contactHistory: [],
        customFields: {}
      }));

      setLeads(enhancedLeads);
    } catch (error) {
      console.error('Error cargando leads de Vicidial:', error);
      throw error;
    }
  };

  const loadPromotions = async () => {
    // En producción, esto vendría de una API o base de datos
    const simulatedPromotions: LeadPromotion[] = [
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
        promotionCode: 'AUTO_PREMIUM',
        promotionName: 'Seguro de Auto Premium',
        description: 'Seguro todo riesgo para vehículos con asistencia 24/7',
        discountType: 'FIXED_AMOUNT',
        discountValue: 200000,
        validFrom: '2024-01-15',
        validUntil: '2024-04-15',
        targetAudience: ['propietarios-vehiculos', 'conductores-jovenes'],
        requirements: 'Vehículo modelo 2018 o superior',
        maxUsage: 500,
        currentUsage: 123,
        status: 'ACTIVE'
      },
      {
        id: 'PROM003',
        promotionCode: 'HOGAR_FAMILIA',
        promotionName: 'Seguro de Hogar Familiar',
        description: 'Protección completa para el hogar con 3 meses gratis',
        discountType: 'FREE_MONTHS',
        discountValue: 3,
        validFrom: '2024-02-01',
        validUntil: '2024-12-31',
        targetAudience: ['propietarios', 'familias'],
        requirements: 'Vivienda propia, estrato 3 o superior',
        currentUsage: 87,
        status: 'ACTIVE'
      }
    ];

    setPromotions(simulatedPromotions);
  };

  const loadCampaignOrigins = async () => {
    const simulatedCampaigns: CampaignOrigin[] = [
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
        campaignName: 'Google Ads - Seguros de Auto',
        source: 'GOOGLE',
        medium: 'CPC',
        costPerLead: 12000,
        totalInvestment: 3000000,
        leadsGenerated: 250,
        conversions: 38,
        roi: 3.2,
        startDate: '2024-01-15',
        status: 'ACTIVE',
        targetAudience: {
          ageRange: '22-55',
          location: ['Bogotá', 'Medellín', 'Barranquilla'],
          interests: ['autos', 'seguros', 'protección vehicular'],
          gender: 'ALL'
        }
      }
    ];

    setCampaignOrigins(simulatedCampaigns);
  };

  const loadSimulatedData = () => {
    // Datos simulados para cuando no hay conexión con Vicidial
    const simulatedLeads: AdvancedLead[] = [
      {
        lead_id: '1001',
        entry_date: '2024-01-15 10:30:00',
        modify_date: '2024-01-15 14:22:00',
        status: 'CALLBACK',
        user: 'asesor1',
        vendor_lead_code: 'FB_VIDA_2024_001',
        source_id: 'FACEBOOK',
        list_id: '101',
        gmt_offset_now: '-5.00',
        called_since_last_reset: 'Y',
        phone_code: '57',
        phone_number: '3001234567',
        title: 'Sr.',
        first_name: 'Juan',
        middle_initial: 'C',
        last_name: 'Pérez',
        address1: 'Calle 123 #45-67',
        address2: 'Apto 301',
        address3: '',
        city: 'Bogotá',
        state: 'DC',
        province: 'Cundinamarca',
        postal_code: '110111',
        country_code: 'CO',
        gender: 'M',
        date_of_birth: '1985-05-15',
        alt_phone: '3109876543',
        email: 'juan.perez@email.com',
        security_phrase: 'MASCOTA123',
        comments: 'Interesado en promoción de seguros de vida. Contactar entre 2-6 PM',
        called_count: 2,
        last_local_call_time: '2024-01-15 14:22:00',
        rank: '0',
        owner: 'asesor1',
        campaignOrigin: {
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
        promotionInterests: [
          {
            id: 'INT001',
            leadId: '1001',
            phoneNumber: '3001234567',
            promotionId: 'PROM001',
            interestLevel: 4,
            capturedDate: '2024-01-15 10:30:00',
            capturedBy: 'asesor1',
            source: 'CALL',
            notes: 'Muy interesado en seguro de vida, tiene 2 hijos menores',
            followUpDate: '2024-01-16 14:00:00',
            status: 'QUALIFIED'
          }
        ],
        leadScore: 85,
        qualificationStatus: 'HOT',
        lastContactAttempt: '2024-01-15 14:22:00',
        nextContactDate: '2024-01-16 14:00:00',
        assignedAgent: 'asesor1',
        priority: 'HIGH',
        conversionProbability: 75,
        estimatedValue: 2400000,
        contactHistory: [
          {
            id: 'HIST001',
            timestamp: '2024-01-15 10:35:00',
            type: 'CALL',
            direction: 'OUTBOUND',
            duration: 420,
            status: 'COMPLETED',
            agentId: 'asesor1',
            agentName: 'María González',
            summary: 'Primera llamada, cliente muy interesado en seguro de vida. Mencionó tener 2 hijos y querer proteger a su familia.',
            promotionDiscussed: 'PROM001',
            objections: ['precio', 'tiempo para decidir'],
            nextAction: 'Enviar cotización personalizada',
            nextActionDate: '2024-01-15 16:00:00',
            outcome: 'POSITIVE',
            qualityScore: 9,
            customerSatisfaction: 8
          },
          {
            id: 'HIST002',
            timestamp: '2024-01-15 14:22:00',
            type: 'CALL',
            direction: 'OUTBOUND',
            duration: 180,
            status: 'CALLBACK_SCHEDULED',
            agentId: 'asesor1',
            agentName: 'María González',
            summary: 'Seguimiento, cliente revisó cotización. Quiere consultar con esposa antes de decidir.',
            promotionDiscussed: 'PROM001',
            nextAction: 'Llamada de cierre',
            nextActionDate: '2024-01-16 14:00:00',
            outcome: 'CALLBACK_REQUIRED',
            qualityScore: 8,
            customerSatisfaction: 9
          }
        ],
        customFields: {
          hasChildren: true,
          numberOfChildren: 2,
          spouseAge: 32,
          monthlyIncome: 4500000,
          currentInsurance: 'No',
          preferredContactTime: '14:00-18:00'
        }
      }
    ];

    setLeads(simulatedLeads);
  };

  // Funciones auxiliares
  const getCampaignOriginByCode = (vendorCode: string): CampaignOrigin => {
    const campaignCode = vendorCode.split('_').slice(0, 3).join('_');
    return campaignOrigins.find(c => c.campaignCode === campaignCode) || campaignOrigins[0];
  };

  const getPromotionInterestsByPhone = (phoneNumber: string): LeadInterest[] => {
    // En producción, esto vendría de la base de datos
    return [];
  };

  const calculateLeadScore = (lead: VicidialLead): number => {
    let score = 50; // Base score
    
    // Aumentar score basado en actividad
    if (lead.called_count > 0) score += 10;
    if (lead.called_count > 2) score += 10;
    
    // Score basado en datos completos
    if (lead.email) score += 5;
    if (lead.alt_phone) score += 5;
    if (lead.comments && lead.comments.length > 10) score += 10;
    
    // Score basado en estado
    if (lead.status === 'CALLBACK') score += 20;
    if (lead.status === 'SALE') score = 100;
    
    return Math.min(score, 100);
  };

  const determineQualificationStatus = (lead: VicidialLead): AdvancedLead['qualificationStatus'] => {
    if (lead.status === 'SALE') return 'HOT';
    if (lead.status === 'CALLBACK') return 'QUALIFIED';
    if (lead.called_count === 0) return 'UNQUALIFIED';
    if (lead.called_count > 3) return 'NURTURING';
    return 'COLD';
  };

  const calculateNextContactDate = (lead: VicidialLead): string => {
    const now = new Date();
    const nextDate = new Date(now);
    
    if (lead.status === 'CALLBACK') {
      nextDate.setDate(now.getDate() + 1);
    } else if (lead.called_count === 0) {
      nextDate.setHours(now.getHours() + 2);
    } else {
      nextDate.setDate(now.getDate() + 3);
    }
    
    return nextDate.toISOString();
  };

  const determinePriority = (lead: VicidialLead): AdvancedLead['priority'] => {
    if (lead.status === 'CALLBACK') return 'HIGH';
    if (lead.called_count === 0) return 'MEDIUM';
    if (lead.called_count > 5) return 'LOW';
    return 'MEDIUM';
  };

  const calculateConversionProbability = (lead: VicidialLead): number => {
    let probability = 20; // Base probability
    
    if (lead.status === 'CALLBACK') probability += 50;
    if (lead.called_count > 0) probability += 10;
    if (lead.comments && lead.comments.includes('interesado')) probability += 20;
    
    return Math.min(probability, 95);
  };

  const calculateEstimatedValue = (lead: VicidialLead): number => {
    // Valor promedio basado en el tipo de seguro/producto
    const baseValues: Record<string, number> = {
      'vida': 2400000,
      'auto': 1800000,
      'hogar': 1200000,
      'salud': 3600000
    };
    
    const productType = lead.comments?.toLowerCase().includes('vida') ? 'vida' :
                       lead.comments?.toLowerCase().includes('auto') ? 'auto' :
                       lead.comments?.toLowerCase().includes('hogar') ? 'hogar' :
                       lead.comments?.toLowerCase().includes('salud') ? 'salud' : 'vida';
    
    return baseValues[productType] || 2000000;
  };

  // Funciones de gestión
  const addContactHistory = async (leadId: string, contactEntry: Omit<ContactHistoryEntry, 'id'>) => {
    const newEntry: ContactHistoryEntry = {
      ...contactEntry,
      id: `HIST_${Date.now()}`
    };

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.lead_id === leadId 
          ? { ...lead, contactHistory: [...lead.contactHistory, newEntry] }
          : lead
      )
    );

    toast({
      title: "Contacto Registrado",
      description: "El historial de contacto ha sido actualizado",
    });
  };

  const addPromotionInterest = async (leadId: string, interest: Omit<LeadInterest, 'id'>) => {
    const newInterest: LeadInterest = {
      ...interest,
      id: `INT_${Date.now()}`
    };

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.lead_id === leadId 
          ? { ...lead, promotionInterests: [...lead.promotionInterests, newInterest] }
          : lead
      )
    );

    toast({
      title: "Interés Registrado",
      description: `Interés en promoción ${interest.promotionId} registrado`,
    });
  };

  const updateLeadStatus = async (leadId: string, newStatus: string, notes?: string) => {
    try {
      // Actualizar en Vicidial
      await vicidialService.updateLeadStatus({
        lead_id: leadId,
        status: newStatus,
        user: 'current_user', // Obtener del contexto de auth
        callback_comments: notes
      });

      // Actualizar localmente
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.lead_id === leadId 
            ? { 
                ...lead, 
                status: newStatus,
                modify_date: new Date().toISOString(),
                qualificationStatus: determineQualificationStatus({ ...lead, status: newStatus }),
                leadScore: calculateLeadScore({ ...lead, status: newStatus })
              }
            : lead
        )
      );

      toast({
        title: "Estado Actualizado",
        description: `Lead actualizado a ${newStatus}`,
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del lead",
        variant: "destructive",
      });
    }
  };

  const getLeadByPhone = (phoneNumber: string): AdvancedLead | undefined => {
    return leads.find(lead => lead.phone_number === phoneNumber || lead.alt_phone === phoneNumber);
  };

  const getLeadsByPromotion = (promotionId: string): AdvancedLead[] => {
    return leads.filter(lead => 
      lead.promotionInterests.some(interest => interest.promotionId === promotionId)
    );
  };

  const getCampaignPerformance = () => {
    const performance = campaignOrigins.map(campaign => {
      const campaignLeads = leads.filter(lead => 
        lead.vendor_lead_code.startsWith(campaign.campaignCode)
      );
      
      const conversions = campaignLeads.filter(lead => lead.status === 'SALE').length;
      const qualified = campaignLeads.filter(lead => lead.qualificationStatus === 'QUALIFIED' || lead.qualificationStatus === 'HOT').length;
      
      return {
        ...campaign,
        actualLeads: campaignLeads.length,
        actualConversions: conversions,
        actualConversionRate: campaignLeads.length > 0 ? (conversions / campaignLeads.length) * 100 : 0,
        qualifiedLeads: qualified,
        qualificationRate: campaignLeads.length > 0 ? (qualified / campaignLeads.length) * 100 : 0,
        actualROI: campaign.totalInvestment > 0 ? (conversions * 2000000 - campaign.totalInvestment) / campaign.totalInvestment : 0
      };
    });

    return performance;
  };

  const getPromotionPerformance = () => {
    return promotions.map(promotion => {
      const interestedLeads = leads.filter(lead => 
        lead.promotionInterests.some(interest => interest.promotionId === promotion.id)
      );
      
      const conversions = interestedLeads.filter(lead => lead.status === 'SALE').length;
      
      return {
        ...promotion,
        interestedLeads: interestedLeads.length,
        conversions,
        conversionRate: interestedLeads.length > 0 ? (conversions / interestedLeads.length) * 100 : 0,
        averageInterestLevel: interestedLeads.length > 0 
          ? interestedLeads.reduce((sum, lead) => sum + (lead.promotionInterests.find(i => i.promotionId === promotion.id)?.interestLevel || 0), 0) / interestedLeads.length
          : 0
      };
    });
  };

  return {
    leads,
    promotions,
    campaignOrigins,
    isLoading,
    filters,
    setFilters,
    addContactHistory,
    addPromotionInterest,
    updateLeadStatus,
    getLeadByPhone,
    getLeadsByPromotion,
    getCampaignPerformance,
    getPromotionPerformance,
    refresh: loadInitialData
  };
};
