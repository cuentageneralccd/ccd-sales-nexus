
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';

export const useRealTimeData = () => {
  const [realTimeStats, setRealTimeStats] = useState({
    activeAgents: 0,
    callsInProgress: 0,
    totalCallsToday: 0,
    avgWaitTime: 0,
    campaignsActive: 0,
    leadsInQueue: 0
  });

  const updateRealTimeStats = () => {
    const agents = dataStore.getAgents();
    const leads = dataStore.getLeads({});
    const campaigns = dataStore.getCampaigns();

    setRealTimeStats({
      activeAgents: agents.filter(a => a.status === 'ONLINE').length,
      callsInProgress: Math.floor(Math.random() * 25), // Simulated
      totalCallsToday: leads.length * 2, // Simulated
      avgWaitTime: Math.floor(Math.random() * 60), // Simulated
      campaignsActive: campaigns.filter(c => c.status === 'ACTIVE').length,
      leadsInQueue: leads.filter(l => l.status === 'NEW').length
    });
  };

  useEffect(() => {
    updateRealTimeStats();
    const interval = setInterval(updateRealTimeStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    realTimeStats,
    updateRealTimeStats
  };
};
