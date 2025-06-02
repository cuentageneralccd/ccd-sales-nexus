import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadPromotions, setLeadPromotions] = useState<LeadPromotion[]>([]);
  const [leadInteractions, setLeadInteractions] = useState<LeadInteraction[]>([]);
  const [campaignProfitability, setCampaignProfitability] = useState<CampaignProfitability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ 
    status: 'all', 
    source: '', 
    search: '',
    campaignCode: '',
    isActive: 'all',
    hasPromotions: 'all'
  });
  const { toast } = useToast();

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const localLeads = dataStore.getLeads(filters);
      setLeads(localLeads);
      
      const localPromotions = dataStore.getLeadPromotions();
      setLeadPromotions(localPromotions);
      
      const localInteractions = dataStore.getLeadInteractions();
      setLeadInteractions(localInteractions);
      
      const localProfitability = dataStore.getCampaignProfitability();
      setCampaignProfitability(localProfitability);
      
      const response = await apiService.getLeads(filters);
      if (response.success) {
        console.log('Leads sincronizados con la API');
      }
    } catch (error) {
      console.error('Error cargando leads:', error);
      const localLeads = dataStore.getLeads(filters);
      setLeads(localLeads);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeadByPhoneNumber = (phoneNumber: string): Lead | undefined => {
    return leads.find(lead => lead.phoneNumber === phoneNumber);
  };

  const getLeadPromotions = (phoneNumber: string): LeadPromotion[] => {
    return leadPromotions.filter(promo => promo.phoneNumber === phoneNumber);
  };

  const getLeadInteractionHistory = (phoneNumber: string): LeadInteraction[] => {
    return leadInteractions
      .filter(interaction => interaction.phoneNumber === phoneNumber)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addPromotionInterest = async (phoneNumber: string, promotionData: Partial<LeadPromotion>) => {
    try {
      const lead = getLeadByPhoneNumber(phoneNumber);
      if (!lead) {
        toast({
          title: "Error",
          description: "Lead no encontrado con ese número telefónico",
          variant: "destructive",
        });
        return;
      }

      const newPromotion: LeadPromotion = {
        id: `promo_${Date.now()}`,
        leadId: lead.id,
        phoneNumber,
        status: 'INTERESTED',
        dateShown: new Date().toISOString(),
        interestLevel: 5,
        notes: '',
        followUpRequired: true,
        ...promotionData
      } as LeadPromotion;

      dataStore.addLeadPromotion(newPromotion);
      await apiService.addLeadPromotion(newPromotion);
      
      toast({
        title: "Promoción Agregada",
        description: "Interés en promoción registrado exitosamente",
      });
      
      await loadLeads();
    } catch (error) {
      console.error('Error agregando promoción:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el interés en la promoción",
        variant: "destructive",
      });
    }
  };

  const updatePromotionStatus = async (promotionId: string, status: LeadPromotion['status'], notes?: string) => {
    try {
      dataStore.updateLeadPromotion(promotionId, { 
        status, 
        responseDate: new Date().toISOString(),
        notes: notes || ''
      });
      
      await apiService.updateLeadPromotion(promotionId, { status, notes });
      
      toast({
        title: "Promoción Actualizada",
        description: `Estado cambiado a ${status}`,
      });
      
      await loadLeads();
    } catch (error) {
      console.error('Error actualizando promoción:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción",
        variant: "destructive",
      });
    }
  };

  const activateLead = async (phoneNumber: string, advisorId: string) => {
    try {
      const lead = getLeadByPhoneNumber(phoneNumber);
      if (!lead) {
        toast({
          title: "Error",
          description: "Lead no encontrado",
          variant: "destructive",
        });
        return;
      }

      const updates = {
        isActive: true,
        activationDate: new Date().toISOString(),
        activatedBy: advisorId,
        status: 'ACTIVE'
      };

      dataStore.updateLead(lead.id, updates);
      await apiService.updateLead(lead.id, updates);
      
      // Registrar interacción de activación
      const activationInteraction: LeadInteraction = {
        id: `interaction_${Date.now()}`,
        leadId: lead.id,
        phoneNumber,
        advisorId,
        interactionType: 'CALL',
        date: new Date().toISOString(),
        duration: 0,
        outcome: 'CONTACT_MADE',
        notes: 'Lead activado - Primera gestión exitosa',
        promotionsDiscussed: []
      };

      dataStore.addLeadInteraction(activationInteraction);
      
      toast({
        title: "Lead Activado",
        description: `Lead ${lead.firstName} ${lead.lastName} ha sido activado`,
      });
      
      await loadLeads();
    } catch (error) {
      console.error('Error activando lead:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el lead",
        variant: "destructive",
      });
    }
  };

  const recordInteraction = async (interactionData: Partial<LeadInteraction>) => {
    try {
      const newInteraction: LeadInteraction = {
        id: `interaction_${Date.now()}`,
        date: new Date().toISOString(),
        duration: 0,
        outcome: 'CONTACT_MADE',
        notes: '',
        promotionsDiscussed: [],
        ...interactionData
      } as LeadInteraction;

      dataStore.addLeadInteraction(newInteraction);
      await apiService.addLeadInteraction(newInteraction);
      
      toast({
        title: "Interacción Registrada",
        description: "Gestión guardada exitosamente",
      });
      
      await loadLeads();
    } catch (error) {
      console.error('Error registrando interacción:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la interacción",
        variant: "destructive",
      });
    }
  };

  const getCampaignProfitabilityReport = (): CampaignProfitability[] => {
    const campaignStats = leads.reduce((acc, lead) => {
      const code = lead.campaignOriginCode;
      if (!acc[code]) {
        acc[code] = {
          campaignCode: code,
          campaignName: `Campaña ${code}`,
          totalInvestment: 0,
          leadsGenerated: 0,
          activatedLeads: 0,
          conversions: 0,
          revenue: 0,
          roi: 0,
          costPerLead: 0,
          costPerActivation: 0,
          costPerConversion: 0,
          profitability: 0
        };
      }
      
      acc[code].leadsGenerated++;
      if (lead.isActive) acc[code].activatedLeads++;
      if (lead.status === 'SALE') acc[code].conversions++;
      
      return acc;
    }, {} as Record<string, CampaignProfitability>);

    // Calcular métricas de rentabilidad (datos simulados para demostración)
    Object.values(campaignStats).forEach(campaign => {
      campaign.totalInvestment = campaign.leadsGenerated * 15000; // $15k por lead
      campaign.revenue = campaign.conversions * 500000; // $500k por venta
      campaign.roi = campaign.revenue > 0 ? ((campaign.revenue - campaign.totalInvestment) / campaign.totalInvestment) * 100 : 0;
      campaign.costPerLead = campaign.leadsGenerated > 0 ? campaign.totalInvestment / campaign.leadsGenerated : 0;
      campaign.costPerActivation = campaign.activatedLeads > 0 ? campaign.totalInvestment / campaign.activatedLeads : 0;
      campaign.costPerConversion = campaign.conversions > 0 ? campaign.totalInvestment / campaign.conversions : 0;
      campaign.profitability = campaign.revenue - campaign.totalInvestment;
    });

    return Object.values(campaignStats);
  };

  const getLeadsByStatus = () => {
    const statusCount = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return statusCount;
  };

  const getActiveLeadsCount = () => {
    return leads.filter(lead => lead.isActive).length;
  };

  const getLeadsWithMultiplePromotions = () => {
    const phoneNumbers = [...new Set(leadPromotions.map(p => p.phoneNumber))];
    return phoneNumbers.filter(phone => 
      leadPromotions.filter(p => p.phoneNumber === phone).length > 1
    ).length;
  };

  const addLead = async (leadData: Partial<Lead>) => {
    setIsLoading(true);
    try {
      const newLeadData = {
        ...leadData,
        isActive: false,
        campaignOriginCode: leadData.campaignOriginCode || leadData.source || 'UNKNOWN'
      };
      
      dataStore.addLead(newLeadData);
      await apiService.createLead(newLeadData);
      
      toast({
        title: "Lead Agregado",
        description: "El lead ha sido sincronizado exitosamente",
      });
      
      await loadLeads();
    } catch (error) {
      console.error('Error agregando lead:', error);
      toast({
        title: "Lead Agregado (Offline)",
        description: "El lead se guardó localmente y se sincronizará cuando haya conexión",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      dataStore.updateLead(id, updates);
      await apiService.updateLead(id, updates);
      await loadLeads();
      
      toast({
        title: "Lead Actualizado",
        description: "Los cambios han sido guardados",
      });
    } catch (error) {
      console.error('Error actualizando lead:', error);
      toast({
        title: "Actualización Offline",
        description: "Los cambios se sincronizarán cuando haya conexión",
      });
    }
  };

  const callLead = async (lead: Lead) => {
    try {
      await apiService.initiateCall(lead.phoneNumber, lead.assignedAgent);
      
      await updateLead(lead.id, {
        callCount: lead.callCount + 1,
        lastCallDate: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Llamada Iniciada",
        description: `Conectando con ${lead.firstName} ${lead.lastName}`,
      });
    } catch (error) {
      console.error('Error iniciando llamada:', error);
      toast({
        title: "Error en Llamada",
        description: "No se pudo iniciar la llamada. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadLeads();
  }, [filters]);

  return {
    leads,
    leadPromotions,
    leadInteractions,
    campaignProfitability,
    isLoading,
    filters,
    setFilters,
    addLead,
    updateLead,
    callLead,
    getLeadByPhoneNumber,
    getLeadPromotions,
    getLeadInteractionHistory,
    addPromotionInterest,
    updatePromotionStatus,
    activateLead,
    recordInteraction,
    getCampaignProfitabilityReport,
    getLeadsByStatus,
    getActiveLeadsCount,
    getLeadsWithMultiplePromotions,
    refresh: loadLeads
  };
};
