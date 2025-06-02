
import { useState, useEffect, useCallback } from 'react';
import { useAdvisorPerformance } from './useAdvisorPerformance';

interface RealTimeMetrics {
  activeAdvisors: number;
  totalCallsInProgress: number;
  averageCallDuration: number;
  currentConversionRate: number;
  systemLoad: number;
  lastUpdate: string;
}

interface AdvisorActivity {
  advisorId: string;
  activity: 'CALL_START' | 'CALL_END' | 'SALE_COMPLETED' | 'BREAK_START' | 'BREAK_END' | 'LOGIN' | 'LOGOUT';
  timestamp: string;
  details?: any;
}

export const useRealTimeAdvisorTracking = () => {
  const { advisors, refresh } = useAdvisorPerformance();
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    activeAdvisors: 0,
    totalCallsInProgress: 0,
    averageCallDuration: 0,
    currentConversionRate: 0,
    systemLoad: 0,
    lastUpdate: new Date().toISOString()
  });
  const [recentActivities, setRecentActivities] = useState<AdvisorActivity[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Simular actividad en tiempo real
  const generateRandomActivity = useCallback(() => {
    if (advisors.length === 0) return;

    const randomAdvisor = advisors[Math.floor(Math.random() * advisors.length)];
    const activities: AdvisorActivity['activity'][] = [
      'CALL_START', 'CALL_END', 'SALE_COMPLETED', 'BREAK_START', 'BREAK_END'
    ];
    
    const activity: AdvisorActivity = {
      advisorId: randomAdvisor.id,
      activity: activities[Math.floor(Math.random() * activities.length)],
      timestamp: new Date().toISOString(),
      details: {
        advisorName: randomAdvisor.name,
        campaign: randomAdvisor.campaign
      }
    };

    setRecentActivities(prev => [activity, ...prev.slice(0, 19)]); // Mantener solo las últimas 20
  }, [advisors]);

  // Calcular métricas en tiempo real
  const updateRealTimeMetrics = useCallback(() => {
    const activeAdvisors = advisors.filter(a => a.status === 'ACTIVE').length;
    const totalCalls = advisors.reduce((sum, a) => sum + a.callsToday, 0);
    const totalSales = advisors.reduce((sum, a) => sum + a.salesToday, 0);
    const avgDuration = advisors.reduce((sum, a) => sum + a.avgCallDuration, 0) / advisors.length;
    
    // Simular llamadas en progreso (entre 10-30% de los asesores activos)
    const callsInProgress = Math.floor(activeAdvisors * (0.1 + Math.random() * 0.2));
    
    // Simular carga del sistema (70-95%)
    const systemLoad = 70 + Math.random() * 25;

    setRealTimeMetrics({
      activeAdvisors,
      totalCallsInProgress: callsInProgress,
      averageCallDuration: Math.round(avgDuration),
      currentConversionRate: totalCalls > 0 ? Math.round((totalSales / totalCalls) * 100 * 10) / 10 : 0,
      systemLoad: Math.round(systemLoad),
      lastUpdate: new Date().toISOString()
    });
  }, [advisors]);

  // Iniciar/detener seguimiento en tiempo real
  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  // Efecto para actualizar métricas cada 5 segundos cuando está activo el tracking
  useEffect(() => {
    if (!isTracking) return;

    const metricsInterval = setInterval(updateRealTimeMetrics, 5000);
    const activityInterval = setInterval(generateRandomActivity, 3000);
    const refreshInterval = setInterval(refresh, 30000); // Refrescar datos cada 30 segundos

    return () => {
      clearInterval(metricsInterval);
      clearInterval(activityInterval);
      clearInterval(refreshInterval);
    };
  }, [isTracking, updateRealTimeMetrics, generateRandomActivity, refresh]);

  // Inicializar métricas
  useEffect(() => {
    updateRealTimeMetrics();
  }, [advisors]);

  // Funciones de utilidad
  const getAdvisorsByStatus = () => {
    return advisors.reduce((acc, advisor) => {
      acc[advisor.status] = (acc[advisor.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getTopPerformersRealTime = () => {
    return advisors
      .filter(a => a.status === 'ACTIVE')
      .sort((a, b) => {
        // Ordenar por una combinación de ventas del día y calidad
        const scoreA = (a.salesToday * 0.7) + (a.qualityScore * 0.3);
        const scoreB = (b.salesToday * 0.7) + (b.qualityScore * 0.3);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  };

  const getAlertsCount = () => {
    let alertsCount = 0;
    
    advisors.forEach(advisor => {
      // Contar alertas críticas
      if (advisor.qualityScore < 60) alertsCount++;
      if (advisor.callsToday < 10) alertsCount++;
      if (advisor.idleTime > 7200) alertsCount++; // Más de 2 horas inactivo
      if (advisor.status === 'OFFLINE') {
        const lastActivity = new Date(advisor.lastActivity);
        const now = new Date();
        const hoursOffline = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        if (hoursOffline > 4) alertsCount++;
      }
    });

    return alertsCount;
  };

  const getActivitySummary = () => {
    const last30Minutes = new Date(Date.now() - 30 * 60 * 1000);
    const recentActivities = recentActivities.filter(
      activity => new Date(activity.timestamp) > last30Minutes
    );

    const summary = recentActivities.reduce((acc, activity) => {
      acc[activity.activity] = (acc[activity.activity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return summary;
  };

  return {
    realTimeMetrics,
    recentActivities,
    isTracking,
    startTracking,
    stopTracking,
    getAdvisorsByStatus,
    getTopPerformersRealTime,
    getAlertsCount,
    getActivitySummary,
    refresh: updateRealTimeMetrics
  };
};
