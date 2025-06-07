
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface LeadClassification {
  id: string;
  leadId: string;
  phoneNumber: string;
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  temperature: 'HOT' | 'WARM' | 'COLD';
  budget: number;
  authority: boolean;
  need: boolean;
  timeline: string;
  painPoints: string[];
  interests: string[];
  lastUpdated: string;
  notes: string;
}

interface LeadObservation {
  id: string;
  leadId: string;
  advisorId: string;
  date: string;
  type: 'BEHAVIOR' | 'INTEREST' | 'OBJECTION' | 'PREFERENCE';
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FollowUpTask {
  id: string;
  leadId: string;
  advisorId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'RESEARCH' | 'PROPOSAL';
  createdDate: string;
  completedDate?: string;
  result?: string;
}

export const useLeadClassification = () => {
  const [classifications, setClassifications] = useState<LeadClassification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadClassifications = async () => {
    setIsLoading(true);
    try {
      const localClassifications = dataStore.getLeadClassifications();
      setClassifications(localClassifications);
      
      const response = await apiService.getLeadClassifications();
      if (response.success) {
        console.log('Lead classifications synchronized');
      }
    } catch (error) {
      console.error('Error loading lead classifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClassification = async (leadId: string, updates: Partial<LeadClassification>) => {
    try {
      dataStore.updateLeadClassification(leadId, updates);
      await apiService.updateLeadClassification(leadId, updates);
      
      toast({
        title: "Classification Updated",
        description: "Lead classification has been saved",
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error updating classification:', error);
      toast({
        title: "Error",
        description: "Could not update classification",
        variant: "destructive",
      });
    }
  };

  const updateLeadStage = async (leadId: string, stage: LeadClassification['stage'], notes: string) => {
    try {
      dataStore.updateLeadClassification(leadId, { 
        stage, 
        notes, 
        lastUpdated: new Date().toISOString() 
      });
      await apiService.updateLeadStage(leadId, stage, notes);
      
      toast({
        title: "Stage Updated",
        description: `Lead moved to ${stage}`,
      });
      
      await loadClassifications();
    } catch (error) {
      console.error('Error updating stage:', error);
      toast({
        title: "Error",
        description: "Could not update stage",
        variant: "destructive",
      });
    }
  };

  const addObservation = async (leadId: string, observation: Partial<LeadObservation>) => {
    try {
      dataStore.addLeadObservation(observation);
      await apiService.addLeadObservation(leadId, observation);
      
      toast({
        title: "Observation Added",
        description: "Lead observation has been recorded",
      });
    } catch (error) {
      console.error('Error adding observation:', error);
      toast({
        title: "Error",
        description: "Could not add observation",
        variant: "destructive",
      });
    }
  };

  const applyPromotion = async (leadId: string, promotionId: string) => {
    try {
      dataStore.applyPromotion(leadId, promotionId);
      await apiService.applyPromotion(leadId, promotionId);
      
      toast({
        title: "Promotion Applied",
        description: "Promotion has been applied to lead",
      });
    } catch (error) {
      console.error('Error applying promotion:', error);
      toast({
        title: "Error",
        description: "Could not apply promotion",
        variant: "destructive",
      });
    }
  };

  const createFollowUpTask = async (taskData: Partial<FollowUpTask>) => {
    try {
      dataStore.addFollowUpTask(taskData);
      await apiService.createFollowUpTask(taskData);
      
      toast({
        title: "Task Created",
        description: "Follow-up task has been scheduled",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Could not create task",
        variant: "destructive",
      });
    }
  };

  const getFollowUpTasks = () => {
    return dataStore.getFollowUpTasks();
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  return {
    classifications,
    isLoading,
    updateClassification,
    updateLeadStage,
    addObservation,
    applyPromotion,
    createFollowUpTask,
    getFollowUpTasks,
    refresh: loadClassifications
  };
};
