
import { useState, useEffect } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface LeadPromotion {
  id: string;
  leadId: string;
  phoneNumber: string;
  promotionId: string;
  promotionName: string;
  interestLevel: number;
  status: 'INTERESTED' | 'PRESENTED' | 'ACCEPTED' | 'REJECTED' | 'PENDING';
  dateShown: string;
  responseDate?: string;
  notes: string;
  followUpRequired: boolean;
  nextFollowUpDate?: string;
}

interface LeadInteraction {
  id: string;
  leadId: string;
  phoneNumber: string;
  advisorId: string;
  interactionType: 'CALL' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'MEETING';
  date: string;
  duration: number;
  outcome: 'CONTACT_MADE' | 'NO_ANSWER' | 'BUSY' | 'VOICEMAIL' | 'APPOINTMENT_SET' | 'SALE' | 'NOT_INTERESTED';
  notes: string;
  promotionsDiscussed: string[];
  nextAction?: string;
  nextActionDate?: string;
}

export const useLeadPromotions = () => {
  const [leadPromotions, setLeadPromotions] = useState<LeadPromotion[]>([]);
  const [leadInteractions, setLeadInteractions] = useState<LeadInteraction[]>([]);
  const { toast } = useToast();

  const loadPromotions = () => {
    const localPromotions = dataStore.getLeadPromotions();
    setLeadPromotions(localPromotions);
    
    const localInteractions = dataStore.getLeadInteractions();
    setLeadInteractions(localInteractions);
  };

  const getLeadPromotions = (phoneNumber: string): LeadPromotion[] => {
    return leadPromotions.filter(promo => promo.phoneNumber === phoneNumber);
  };

  const getLeadInteractionHistory = (phoneNumber: string): LeadInteraction[] => {
    return leadInteractions
      .filter(interaction => interaction.phoneNumber === phoneNumber)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addPromotionInterest = async (phoneNumber: string, promotionData: Partial<LeadPromotion>) => {
    try {
      const leads = dataStore.getLeads({});
      const lead = leads.find(l => l.phoneNumber === phoneNumber);
      
      if (!lead) {
        toast({
          title: "Error",
          description: "Lead no encontrado con ese número telefónico",
          variant: "destructive",
        });
        return;
      }

      const newPromotion: LeadPromotion = {
        id: `promo_${Date.now()}`,
        leadId: lead.id,
        phoneNumber,
        status: 'INTERESTED',
        dateShown: new Date().toISOString(),
        interestLevel: 5,
        notes: '',
        followUpRequired: true,
        ...promotionData
      } as LeadPromotion;

      dataStore.addLeadPromotion(newPromotion);
      await apiService.addLeadPromotion(newPromotion);
      
      toast({
        title: "Promoción Agregada",
        description: "Interés en promoción registrado exitosamente",
      });
      
      loadPromotions();
    } catch (error) {
      console.error('Error agregando promoción:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el interés en la promoción",
        variant: "destructive",
      });
    }
  };

  const updatePromotionStatus = async (promotionId: string, status: LeadPromotion['status'], notes?: string) => {
    try {
      dataStore.updateLeadPromotion(promotionId, { 
        status, 
        responseDate: new Date().toISOString(),
        notes: notes || ''
      });
      
      await apiService.updateLeadPromotion(promotionId, { status, notes });
      
      toast({
        title: "Promoción Actualizada",
        description: `Estado cambiado a ${status}`,
      });
      
      loadPromotions();
    } catch (error) {
      console.error('Error actualizando promoción:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción",
        variant: "destructive",
      });
    }
  };

  const recordInteraction = async (interactionData: Partial<LeadInteraction>) => {
    try {
      const newInteraction: LeadInteraction = {
        id: `interaction_${Date.now()}`,
        date: new Date().toISOString(),
        duration: 0,
        outcome: 'CONTACT_MADE',
        notes: '',
        promotionsDiscussed: [],
        ...interactionData
      } as LeadInteraction;

      dataStore.addLeadInteraction(newInteraction);
      await apiService.addLeadInteraction(newInteraction);
      
      toast({
        title: "Interacción Registrada",
        description: "Gestión guardada exitosamente",
      });
      
      loadPromotions();
    } catch (error) {
      console.error('Error registrando interacción:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la interacción",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  return {
    leadPromotions,
    leadInteractions,
    getLeadPromotions,
    getLeadInteractionHistory,
    addPromotionInterest,
    updatePromotionStatus,
    recordInteraction,
    refresh: loadPromotions
  };
};
