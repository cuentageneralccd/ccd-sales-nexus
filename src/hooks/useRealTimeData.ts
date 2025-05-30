
import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@/services/dataStore';

interface RealTimeStats {
  activeAgents: number;
  todayCalls: number;
  conversionRate: number;
  avgCallTime: number;
  callsInProgress: number;
  leadsToday: number;
  salesToday: number;
  queueSize: number;
}

export const useRealTimeData = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeAgents: 0,
    todayCalls: 0,
    conversionRate: 0,
    avgCallTime: 0,
    callsInProgress: 0,
    leadsToday: 0,
    salesToday: 0,
    queueSize: 0
  });

  const [isConnected, setIsConnected] = useState(false);

  const updateStats = useCallback(() => {
    const agents = dataStore.getAgents();
    const leads = dataStore.getLeads();
    const campaigns = dataStore.getCampaigns();

    // Simular datos en tiempo real
    const now = new Date();
    const todayLeads = leads.filter(lead => {
      const leadDate = new Date(lead.entryDate);
      return leadDate.toDateString() === now.toDateString();
    });

    const todaySales = leads.filter(lead => 
      lead.status === 'SALE' && 
      lead.lastCallDate === now.toISOString().split('T')[0]
    );

    const activeAgents = agents.filter(agent => 
      agent.status === 'READY' || agent.status === 'INCALL'
    ).length;

    const callsInProgress = agents.filter(agent => 
      agent.status === 'INCALL'
    ).length;

    // Calcular estadísticas agregadas
    const totalCalls = agents.reduce((sum, agent) => sum + agent.callsToday, 0);
    const totalSales = agents.reduce((sum, agent) => sum + agent.salesToday, 0);
    const avgCallTime = agents.reduce((sum, agent) => sum + agent.avgCallTime, 0) / agents.length;

    setStats({
      activeAgents,
      todayCalls: totalCalls,
      conversionRate: totalCalls > 0 ? Math.round((totalSales / totalCalls) * 100 * 10) / 10 : 0,
      avgCallTime: Math.round(avgCallTime),
      callsInProgress,
      leadsToday: todayLeads.length,
      salesToday: totalSales,
      queueSize: Math.floor(Math.random() * 15) + 5 // Simular cola
    });

    setIsConnected(true);
  }, []);

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    updateStats();
    
    const interval = setInterval(() => {
      updateStats();
      
      // Simular variaciones aleatorias para hacer más realista
      setStats(prevStats => ({
        ...prevStats,
        todayCalls: prevStats.todayCalls + Math.floor(Math.random() * 3),
        callsInProgress: Math.max(0, prevStats.callsInProgress + (Math.random() > 0.5 ? 1 : -1)),
        queueSize: Math.max(0, prevStats.queueSize + (Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? -1 : 0))
      }));
    }, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [updateStats]);

  // Simular desconexiones ocasionales
  useEffect(() => {
    const disconnectInterval = setInterval(() => {
      if (Math.random() < 0.02) { // 2% probabilidad de desconexión
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000); // Reconectar después de 2 segundos
      }
    }, 10000);

    return () => clearInterval(disconnectInterval);
  }, []);

  return {
    stats,
    isConnected,
    refresh: updateStats
  };
};
