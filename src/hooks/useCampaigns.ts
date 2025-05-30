
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const localCampaigns = dataStore.getCampaigns();
      setCampaigns(localCampaigns);
      
      const response = await apiService.getCampaigns();
      if (response.success) {
        console.log('Campañas sincronizadas con la API');
      }
    } catch (error) {
      console.error('Error cargando campañas:', error);
      const localCampaigns = dataStore.getCampaigns();
      setCampaigns(localCampaigns);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    setIsLoading(true);
    try {
      dataStore.addCampaign(campaignData);
      
      await apiService.createCampaign(campaignData);
      
      toast({
        title: "Campaña Creada",
        description: "La campaña ha sido configurada exitosamente",
      });
      
      await loadCampaigns();
    } catch (error) {
      console.error('Error creando campaña:', error);
      toast({
        title: "Campaña Creada (Offline)",
        description: "La campaña se guardó localmente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId: string, newStatus: Campaign['status']) => {
    try {
      dataStore.updateCampaign(campaignId, { status: newStatus });
      
      await apiService.updateCampaignStatus(campaignId, newStatus);
      
      await loadCampaigns();
      
      toast({
        title: "Campaña Actualizada",
        description: `Estado cambiado a ${newStatus}`,
      });
    } catch (error) {
      console.error('Error actualizando campaña:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la campaña",
        variant: "destructive",
      });
    }
  };

  const getCampaignStats = () => {
    const stats = campaigns.reduce((acc, campaign) => {
      acc.totalLeads += campaign.totalLeads;
      acc.totalContacted += campaign.contactedLeads;
      acc.totalSales += campaign.successfulCalls;
      acc.activeCampaigns += campaign.status === 'ACTIVE' ? 1 : 0;
      return acc;
    }, {
      totalLeads: 0,
      totalContacted: 0,
      totalSales: 0,
      activeCampaigns: 0,
      avgConversion: 0
    });

    stats.avgConversion = stats.totalContacted > 0 
      ? Math.round((stats.totalSales / stats.totalContacted) * 100 * 10) / 10
      : 0;

    return stats;
  };

  const getTopPerformingCampaigns = () => {
    return campaigns
      .filter(campaign => campaign.status === 'ACTIVE')
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 3);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
    createCampaign,
    updateCampaignStatus,
    getCampaignStats,
    getTopPerformingCampaigns,
    refresh: loadCampaigns
  };
};
