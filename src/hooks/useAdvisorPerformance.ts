
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AdvisorMetrics {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'BREAK' | 'LUNCH' | 'TRAINING' | 'OFFLINE';
  campaign: string;
  shift: string;
  
  // Métricas de llamadas
  callsToday: number;
  callsWeek: number;
  callsMonth: number;
  avgCallDuration: number;
  totalCallTime: number;
  
  // Métricas de conversión
  contactsToday: number;
  appointmentsToday: number;
  salesToday: number;
  conversionRate: number;
  appointmentRate: number;
  
  // Métricas de calidad
  qualityScore: number;
  customerSatisfaction: number;
  scriptCompliance: number;
  objectionHandling: number;
  
  // Productividad
  leadsAssigned: number;
  leadsContacted: number;
  leadsConverted: number;
  avgResponseTime: number;
  followUpRate: number;
  
  // Horarios y asistencia
  loginTime: string;
  breakTime: number;
  productiveTime: number;
  idleTime: number;
  
  lastActivity: string;
  ranking: number;
}

interface QualityReview {
  id: string;
  advisorId: string;
  reviewerId: string;
  callId: string;
  date: string;
  scores: {
    greeting: number;
    productKnowledge: number;
    objectionHandling: number;
    closing: number;
    overall: number;
  };
  comments: string;
  recommendations: string[];
  status: 'PENDING' | 'REVIEWED' | 'DISPUTED';
}

export const useAdvisorPerformance = () => {
  const [advisors, setAdvisors] = useState<AdvisorMetrics[]>([]);
  const [qualityReviews, setQualityReviews] = useState<QualityReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAdvisorMetrics = async () => {
    setIsLoading(true);
    try {
      const localAdvisors = dataStore.getAdvisorMetrics();
      setAdvisors(localAdvisors);
      
      const response = await apiService.getAdvisorMetrics();
      if (response.success) {
        console.log('Métricas de asesores sincronizadas');
      }
    } catch (error) {
      console.error('Error cargando métricas de asesores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdvisorStatus = async (advisorId: string, status: AdvisorMetrics['status']) => {
    try {
      dataStore.updateAdvisorStatus(advisorId, status);
      await apiService.updateAdvisorStatus(advisorId, status);
      await loadAdvisorMetrics();
      
      toast({
        title: "Estado Actualizado",
        description: `Estado del asesor cambiado a ${status}`,
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const createQualityReview = async (reviewData: Partial<QualityReview>) => {
    try {
      dataStore.addQualityReview(reviewData);
      await apiService.createQualityReview(reviewData);
      
      toast({
        title: "Revisión de Calidad Creada",
        description: "La evaluación ha sido guardada exitosamente",
      });
      
      await loadQualityReviews();
    } catch (error) {
      console.error('Error creando revisión de calidad:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la evaluación",
        variant: "destructive",
      });
    }
  };

  const loadQualityReviews = async () => {
    try {
      const reviews = dataStore.getQualityReviews();
      setQualityReviews(reviews);
    } catch (error) {
      console.error('Error cargando revisiones de calidad:', error);
    }
  };

  const getTopPerformers = () => {
    return advisors
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 10);
  };

  const getLowPerformers = () => {
    return advisors
      .filter(advisor => advisor.qualityScore < 70)
      .sort((a, b) => a.qualityScore - b.qualityScore);
  };

  const getTeamStats = () => {
    const totalAdvisors = advisors.length;
    const activeAdvisors = advisors.filter(a => a.status === 'ACTIVE').length;
    const avgQuality = advisors.reduce((sum, a) => sum + a.qualityScore, 0) / totalAdvisors;
    const totalCalls = advisors.reduce((sum, a) => sum + a.callsToday, 0);
    const totalSales = advisors.reduce((sum, a) => sum + a.salesToday, 0);
    
    return {
      totalAdvisors,
      activeAdvisors,
      avgQuality: Math.round(avgQuality * 10) / 10,
      totalCalls,
      totalSales,
      avgConversion: totalCalls > 0 ? Math.round((totalSales / totalCalls) * 100 * 10) / 10 : 0
    };
  };

  useEffect(() => {
    loadAdvisorMetrics();
    loadQualityReviews();
    
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(loadAdvisorMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    advisors,
    qualityReviews,
    isLoading,
    selectedAdvisor,
    setSelectedAdvisor,
    updateAdvisorStatus,
    createQualityReview,
    getTopPerformers,
    getLowPerformers,
    getTeamStats,
    refresh: loadAdvisorMetrics
  };
};
