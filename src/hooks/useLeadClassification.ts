
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
  // Additional properties needed by the component
  advisorId: string;
  currentStage: string;
  leadType: 'HOT' | 'WARM' | 'COLD' | 'QUALIFIED' | 'UNQUALIFIED';
  stageHistory: Array<{id: string; stage: string; date: string}>;
  interest_level: number;
  budget_range: string;
  decision_timeline: string;
  authority_level: string;
  observations: Array<{id: string; type: string; content: string; date: string}>;
  promotions: Array<{id: string; name: string; status: string; discount: number}>;
  nextContactDate: string;
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
  scheduledDate: string;
}

export const useLeadClassification = () => {
  const [classifications, setClassifications] = useState<LeadClassification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadClassifications = async () => {
    setIsLoading(true);
    try {
      const localClassifications = dataStore.getLeadClassifications();
      // Transform the data to match the expected interface
      const transformedClassifications = localClassifications.map(cls => ({
        ...cls,
        advisorId: 'current_advisor',
        currentStage: cls.stage,
        leadType: cls.temperature as any,
        stageHistory: [{id: '1', stage: cls.stage, date: cls.lastUpdated}],
        interest_level: 7,
        budget_range: '$10,000 - $50,000',
        decision_timeline: cls.timeline,
        authority_level: cls.authority ? 'High' : 'Low',
        observations: [],
        promotions: [],
        nextContactDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      setClassifications(transformedClassifications);
      
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

  const getFollowUpTasks = (): FollowUpTask[] => {
    return dataStore.getFollowUpTasks().map(task => ({
      ...task,
      scheduledDate: task.dueDate
    }));
  };

  const classifyLead = async (leadId: string, classification: Partial<LeadClassification>) => {
    return updateClassification(leadId, classification);
  };

  const getLeadsByStage = () => {
    return classifications.reduce((acc, cls) => {
      acc[cls.stage] = (acc[cls.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getConversionFunnel = () => {
    const stages = ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const total = classifications.length;
    
    return stages.map(stage => {
      const count = classifications.filter(cls => cls.stage === stage).length;
      return {
        stage,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      };
    });
  };

  const getOverdueTasks = (): FollowUpTask[] => {
    const tasks = getFollowUpTasks();
    const now = new Date();
    return tasks.filter(task => 
      task.status === 'PENDING' && new Date(task.scheduledDate) < now
    );
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  return {
    classifications,
    followUpTasks: getFollowUpTasks(),
    isLoading,
    updateClassification,
    updateLeadStage,
    addObservation,
    applyPromotion,
    createFollowUpTask,
    getFollowUpTasks,
    classifyLead,
    getLeadsByStage,
    getConversionFunnel,
    getOverdueTasks,
    refresh: loadClassifications
  };
};
