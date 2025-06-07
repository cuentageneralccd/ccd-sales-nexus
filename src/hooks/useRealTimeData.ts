
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';

export const useRealTimeData = () => {
  const [realTimeStats, setRealTimeStats] = useState({
    activeAgents: 0,
    callsInProgress: 0,
    totalCallsToday: 0,
    avgWaitTime: 0,
    campaignsActive: 0,
    leadsInQueue: 0,
    todayCalls: 0,
    conversionRate: 0,
    salesToday: 0,
    avgCallTime: 0,
    queueSize: 0
  });

  const [isConnected, setIsConnected] = useState(true);

  const updateRealTimeStats = () => {
    const agents = dataStore.getAgents();
    const leads = dataStore.getLeads({});
    const campaigns = dataStore.getCampaigns();

    const activeAgents = agents.filter(a => a.status === 'ONLINE').length;
    const callsInProgress = Math.floor(Math.random() * 25);
    const totalCallsToday = leads.length * 2;
    const avgWaitTime = Math.floor(Math.random() * 60);
    const campaignsActive = campaigns.filter(c => c.status === 'ACTIVE').length;
    const leadsInQueue = leads.filter(l => l.status === 'NEW').length;

    setRealTimeStats({
      activeAgents,
      callsInProgress,
      totalCallsToday,
      avgWaitTime,
      campaignsActive,
      leadsInQueue,
      todayCalls: totalCallsToday,
      conversionRate: Math.floor(Math.random() * 20) + 10,
      salesToday: Math.floor(Math.random() * 15) + 5,
      avgCallTime: Math.floor(Math.random() * 180) + 120,
      queueSize: leadsInQueue
    });
  };

  useEffect(() => {
    updateRealTimeStats();
    const interval = setInterval(updateRealTimeStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    realTimeStats,
    stats: realTimeStats,
    isConnected,
    updateRealTimeStats
  };
};
