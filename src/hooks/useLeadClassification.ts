
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface LeadClassification {
  id: string;
  leadId: string;
  advisorId: string;
  
  // Tipificación
  leadType: 'HOT' | 'WARM' | 'COLD' | 'QUALIFIED' | 'UNQUALIFIED';
  interest_level: number; // 1-10
  budget_range: 'LOW' | 'MEDIUM' | 'HIGH' | 'PREMIUM';
  decision_timeline: 'IMMEDIATE' | 'WEEK' | 'MONTH' | 'QUARTER' | 'LONG_TERM';
  authority_level: 'DECISION_MAKER' | 'INFLUENCER' | 'USER' | 'UNKNOWN';
  
  // Seguimiento de etapas
  currentStage: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PRESENTATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  previousStages: string[];
  stageHistory: {
    stage: string;
    date: string;
    advisorId: string;
    duration: number; // minutos en la etapa
    notes: string;
  }[];
  
  // Observaciones y seguimiento
  observations: {
    id: string;
    date: string;
    advisorId: string;
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK';
    content: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    followUpDate?: string;
    completed: boolean;
  }[];
  
  // Promociones y ofertas
  promotions: {
    id: string;
    name: string;
    description: string;
    discount: number;
    validUntil: string;
    applied: boolean;
    appliedDate?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  }[];
  
  // Métricas de seguimiento
  contactAttempts: number;
  lastContactDate: string;
  nextContactDate: string;
  responseRate: number;
  engagementScore: number;
  
  createdAt: string;
  updatedAt: string;
}

interface FollowUpTask {
  id: string;
  leadId: string;
  advisorId: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'QUOTE' | 'PRESENTATION';
  title: string;
  description: string;
  scheduledDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedDate?: string;
  result?: string;
  nextAction?: string;
}

export const useLeadClassification = () => {
  const [classifications, setClassifications] = useState<LeadClassification[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadClassifications = async () => {
    setIsLoading(true);
    try {
      const localData = dataStore.getLeadClassifications();
      setClassifications(localData);
      
      const response = await apiService.getLeadClassifications();
      if (response.success) {
        console.log('Clasificaciones sincronizadas');
      }
    } catch (error) {
      console.error('Error cargando clasificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyLead = async (leadId: string, classification: Partial<LeadClassification>) => {
    try {
      dataStore.updateLeadClassification(leadId, classification);
      await apiService.updateLeadClassification(leadId, classification);
      
      toast({
        title: "Lead Clasificado",
        description: "La clasificación ha sido actualizada",
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error clasificando lead:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la clasificación",
        variant: "destructive",
      });
    }
  };

  const updateLeadStage = async (leadId: string, newStage: LeadClassification['currentStage'], notes: string = '') => {
    try {
      const classification = classifications.find(c => c.leadId === leadId);
      if (!classification) return;

      const stageEntry = {
        stage: newStage,
        date: new Date().toISOString(),
        advisorId: classification.advisorId,
        duration: 0, // Calcular basado en la etapa anterior
        notes
      };

      const updatedClassification = {
        ...classification,
        currentStage: newStage,
        previousStages: [...classification.previousStages, classification.currentStage],
        stageHistory: [...classification.stageHistory, stageEntry],
        updatedAt: new Date().toISOString()
      };

      dataStore.updateLeadClassification(leadId, updatedClassification);
      await apiService.updateLeadStage(leadId, newStage, notes);
      
      toast({
        title: "Etapa Actualizada",
        description: `Lead movido a ${newStage}`,
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error actualizando etapa:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la etapa",
        variant: "destructive",
      });
    }
  };

  const addObservation = async (leadId: string, observation: Omit<LeadClassification['observations'][0], 'id'>) => {
    try {
      const newObservation = {
        ...observation,
        id: `obs_${Date.now()}`,
      };

      dataStore.addLeadObservation(leadId, newObservation);
      await apiService.addLeadObservation(leadId, newObservation);
      
      toast({
        title: "Observación Agregada",
        description: "La nota ha sido guardada",
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error agregando observación:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la observación",
        variant: "destructive",
      });
    }
  };

  const applyPromotion = async (leadId: string, promotionId: string) => {
    try {
      dataStore.applyPromotion(leadId, promotionId);
      await apiService.applyPromotion(leadId, promotionId);
      
      toast({
        title: "Promoción Aplicada",
        description: "La oferta ha sido aplicada al lead",
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error aplicando promoción:', error);
      toast({
        title: "Error",
        description: "No se pudo aplicar la promoción",
        variant: "destructive",
      });
    }
  };

  const createFollowUpTask = async (task: Omit<FollowUpTask, 'id'>) => {
    try {
      const newTask = {
        ...task,
        id: `task_${Date.now()}`,
      };

      dataStore.addFollowUpTask(newTask);
      await apiService.createFollowUpTask(newTask);
      
      toast({
        title: "Tarea Creada",
        description: "Recordatorio de seguimiento programado",
      });
      
      await loadFollowUpTasks();
    } catch (error) {
      console.error('Error creando tarea:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la tarea",
        variant: "destructive",
      });
    }
  };

  const loadFollowUpTasks = async () => {
    try {
      const tasks = dataStore.getFollowUpTasks();
      setFollowUpTasks(tasks);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  };

  const getLeadsByStage = () => {
    const stageCount = classifications.reduce((acc, classification) => {
      acc[classification.currentStage] = (acc[classification.currentStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stageCount;
  };

  const getConversionFunnel = () => {
    const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'PRESENTATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'];
    const funnel = stages.map(stage => ({
      stage,
      count: classifications.filter(c => c.currentStage === stage).length,
      percentage: 0
    }));

    const total = funnel[0]?.count || 1;
    funnel.forEach(item => {
      item.percentage = Math.round((item.count / total) * 100);
    });

    return funnel;
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return followUpTasks.filter(task => 
      task.status === 'PENDING' && 
      new Date(task.scheduledDate) < now
    );
  };

  useEffect(() => {
    loadClassifications();
    loadFollowUpTasks();
  }, []);

  return {
    classifications,
    followUpTasks,
    isLoading,
    classifyLead,
    updateLeadStage,
    addObservation,
    applyPromotion,
    createFollowUpTask,
    getLeadsByStage,
    getConversionFunnel,
    getOverdueTasks,
    refresh: loadClassifications
  };
};
