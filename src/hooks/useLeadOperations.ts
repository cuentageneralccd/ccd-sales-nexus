
import { useState } from 'react';
import { dataStore } from '@/services/dataStore';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  vendorLeadCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  status: string;
  source: string;
  entryDate: string;
  lastCallDate?: string;
  callCount: number;
  comments: string;
  priority: number;
  score: number;
  assignedAgent: string;
  campaignOriginCode: string;
  isActive: boolean;
  activationDate?: string;
  activatedBy?: string;
}

export const useLeadOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addLead = async (leadData: Partial<Lead>) => {
    setIsLoading(true);
    try {
      const newLeadData = {
        ...leadData,
        isActive: false,
        campaignOriginCode: leadData.campaignOriginCode || leadData.source || 'UNKNOWN'
      };
      
      dataStore.addLead(newLeadData);
      await apiService.createLead(newLeadData);
      
      toast({
        title: "Lead Agregado",
        description: "El lead ha sido sincronizado exitosamente",
      });
    } catch (error) {
      console.error('Error agregando lead:', error);
      toast({
        title: "Lead Agregado (Offline)",
        description: "El lead se guardó localmente y se sincronizará cuando haya conexión",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      dataStore.updateLead(id, updates);
      await apiService.updateLead(id, updates);
      
      toast({
        title: "Lead Actualizado",
        description: "Los cambios han sido guardados",
      });
    } catch (error) {
      console.error('Error actualizando lead:', error);
      toast({
        title: "Actualización Offline",
        description: "Los cambios se sincronizarán cuando haya conexión",
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      setIsLoading(true);
      
      dataStore.deleteLead(leadId);
      
      try {
        await apiService.deleteLead(leadId);
      } catch (error) {
        console.warn('No se pudo eliminar del servidor, eliminado localmente');
      }
      
      toast({
        title: "Lead Eliminado",
        description: "El lead ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error eliminando lead:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el lead",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const callLead = async (lead: Lead) => {
    try {
      await apiService.initiateCall(lead.phoneNumber, lead.assignedAgent);
      
      await updateLead(lead.id, {
        callCount: lead.callCount + 1,
        lastCallDate: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Llamada Iniciada",
        description: `Conectando con ${lead.firstName} ${lead.lastName}`,
      });
    } catch (error) {
      console.error('Error iniciando llamada:', error);
      toast({
        title: "Error en Llamada",
        description: "No se pudo iniciar la llamada. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const scheduleCallback = async (leadId: string, callbackDate: string, notes: string) => {
    try {
      const updates = {
        status: 'CALLBACK',
        comments: notes,
        nextAction: 'CALLBACK_SCHEDULED',
        nextActionDate: callbackDate
      };

      await updateLead(leadId, updates);
      
      toast({
        title: "Callback Programado",
        description: `Callback programado para ${new Date(callbackDate).toLocaleDateString()}`,
      });
    } catch (error) {
      console.error('Error programando callback:', error);
      toast({
        title: "Error",
        description: "No se pudo programar el callback",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    addLead,
    updateLead,
    deleteLead,
    callLead,
    scheduleCallback
  };
};
