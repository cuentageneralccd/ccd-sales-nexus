
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useLeadOperations } from './useLeadOperations';
import { useLeadAnalytics } from './useLeadAnalytics';
import { useLeadPromotions } from './useLeadPromotions';

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

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
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

  // Use the smaller hooks
  const leadOperations = useLeadOperations();
  const leadAnalytics = useLeadAnalytics();
  const leadPromotions = useLeadPromotions();

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const localLeads = dataStore.getLeads(filters);
      setLeads(localLeads);
      
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
      
      // Register activation interaction
      const activationInteraction = {
        id: `interaction_${Date.now()}`,
        leadId: lead.id,
        phoneNumber,
        advisorId,
        interactionType: 'CALL' as const,
        date: new Date().toISOString(),
        duration: 0,
        outcome: 'CONTACT_MADE' as const,
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

  const getLeadsWithMultiplePromotions = () => {
    const phoneNumbers = [...new Set(leadPromotions.leadPromotions.map(p => p.phoneNumber))];
    return phoneNumbers.filter(phone => 
      leadPromotions.leadPromotions.filter(p => p.phoneNumber === phone).length > 1
    ).length;
  };

  useEffect(() => {
    loadLeads();
  }, [filters]);

  return {
    leads,
    leadPromotions: leadPromotions.leadPromotions,
    leadInteractions: leadPromotions.leadInteractions,
    campaignProfitability: leadAnalytics.getCampaignProfitabilityReport(),
    isLoading: isLoading || leadOperations.isLoading,
    filters,
    setFilters,
    addLead: leadOperations.addLead,
    updateLead: leadOperations.updateLead,
    deleteLead: leadOperations.deleteLead,
    scheduleCallback: leadOperations.scheduleCallback,
    callLead: leadOperations.callLead,
    getLeadByPhoneNumber,
    getLeadPromotions: leadPromotions.getLeadPromotions,
    getLeadInteractionHistory: leadPromotions.getLeadInteractionHistory,
    addPromotionInterest: leadPromotions.addPromotionInterest,
    updatePromotionStatus: leadPromotions.updatePromotionStatus,
    activateLead,
    recordInteraction: leadPromotions.recordInteraction,
    getCampaignProfitabilityReport: leadAnalytics.getCampaignProfitabilityReport,
    getLeadsByStatus: leadAnalytics.getLeadsByStatus,
    getLeadsBySource: leadAnalytics.getLeadsBySource,
    getHighPriorityLeads: leadAnalytics.getHighPriorityLeads,
    getActiveLeadsCount: leadAnalytics.getActiveLeadsCount,
    getLeadsWithMultiplePromotions,
    refresh: loadLeads
  };
};
