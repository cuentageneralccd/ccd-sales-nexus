
import { useState, useEffect } from 'react';
import { vicidialService, VicidialLead } from '@/services/vicidialService';
import { dataStore } from '@/services/dataStore';
import { useToast } from '@/hooks/use-toast';

interface AdvancedLead extends VicidialLead {
  gmt_offset_now?: string;
  alt_phone?: string;
  owner?: string;
  rank?: number;
  score?: number;
  called_since_last_reset?: string;
  status_change_date?: string;
  modify_date?: string;
  list_name?: string;
  campaign_name?: string;
  last_local_call_time?: string;
}

interface SearchFilters {
  phoneNumber?: string;
  status?: string;
  campaign?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  records?: number;
}

export const useAdvancedLeadTracking = () => {
  const [leads, setLeads] = useState<AdvancedLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchLeads = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const results = await vicidialService.searchLeads(filters);
      const enhancedLeads = results.map(lead => ({
        ...lead,
        owner: lead.user || 'N/A',
        alt_phone: lead.phone_number || '',
        rank: Math.floor(Math.random() * 100),
        score: Math.floor(Math.random() * 100)
      }));
      setLeads(enhancedLeads);
    } catch (error) {
      console.error('Error searching leads:', error);
      toast({
        title: "Error",
        description: "No se pudieron buscar los leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string, notes?: string) => {
    try {
      await vicidialService.updateLeadStatus(leadId, status, notes);
      toast({
        title: "Lead Actualizado",
        description: "El estado del lead se ha actualizado correctamente",
      });
      
      // Refresh leads
      const currentFilters = { status: 'all' };
      await searchLeads(currentFilters);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el lead",
        variant: "destructive",
      });
    }
  };

  const getCallHistory = async (agentId?: string, dateRange?: { start: string; end: string }) => {
    try {
      return await vicidialService.getCallLog(agentId, dateRange);
    } catch (error) {
      console.error('Error getting call history:', error);
      return [];
    }
  };

  return {
    leads,
    isLoading,
    searchLeads,
    updateLeadStatus,
    getCallHistory
  };
};
