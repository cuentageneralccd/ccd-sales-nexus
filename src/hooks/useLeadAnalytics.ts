
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';

interface Lead {
  id: string;
  status: string;
  source: string;
  priority: number;
  isActive: boolean;
  campaignOriginCode?: string; // Make it optional to fix the error
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

export const useLeadAnalytics = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = () => {
    const localLeads = dataStore.getLeads({});
    setLeads(localLeads);
  };

  const getLeadsByStatus = () => {
    const statusCount = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return statusCount;
  };

  const getLeadsBySource = () => {
    const sourceCount = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return sourceCount;
  };

  const getHighPriorityLeads = () => {
    return leads.filter(lead => lead.priority >= 8);
  };

  const getActiveLeadsCount = () => {
    return leads.filter(lead => lead.isActive).length;
  };

  const getCampaignProfitabilityReport = (): CampaignProfitability[] => {
    const campaignStats = leads.reduce((acc, lead) => {
      const code = lead.campaignOriginCode || 'UNKNOWN';
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

    Object.values(campaignStats).forEach(campaign => {
      campaign.totalInvestment = campaign.leadsGenerated * 15000;
      campaign.revenue = campaign.conversions * 500000;
      campaign.roi = campaign.revenue > 0 ? ((campaign.revenue - campaign.totalInvestment) / campaign.totalInvestment) * 100 : 0;
      campaign.costPerLead = campaign.leadsGenerated > 0 ? campaign.totalInvestment / campaign.leadsGenerated : 0;
      campaign.costPerActivation = campaign.activatedLeads > 0 ? campaign.totalInvestment / campaign.activatedLeads : 0;
      campaign.costPerConversion = campaign.conversions > 0 ? campaign.totalInvestment / campaign.conversions : 0;
      campaign.profitability = campaign.revenue - campaign.totalInvestment;
    });

    return Object.values(campaignStats);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return {
    leads,
    getLeadsByStatus,
    getLeadsBySource,
    getHighPriorityLeads,
    getActiveLeadsCount,
    getCampaignProfitabilityReport,
    refresh: loadLeads
  };
};
