
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface VicidialStats {
  activeAgents: number;
  todayCalls: number;
  conversionRate: number;
  avgCallTime: number;
  activeLeads: number;
  activeCampaigns: number;
  systemHealth: number;
}

export const useVicidialStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['vicidial-stats'],
    queryFn: async (): Promise<VicidialStats> => {
      // Simulación de datos en tiempo real
      // En producción, esto conectaría con la API de Vicidial
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        activeAgents: Math.floor(Math.random() * 50) + 10,
        todayCalls: Math.floor(Math.random() * 1000) + 500,
        conversionRate: Math.floor(Math.random() * 30) + 15,
        avgCallTime: Math.floor(Math.random() * 120) + 60,
        activeLeads: Math.floor(Math.random() * 5000) + 1000,
        activeCampaigns: Math.floor(Math.random() * 10) + 3,
        systemHealth: Math.floor(Math.random() * 20) + 80
      };
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  return { stats, isLoading, error };
};
