
import { useState, useEffect } from 'react';
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
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', source: '', search: '' });
  const { toast } = useToast();

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      // Primero cargar desde el store local
      const localLeads = dataStore.getLeads(filters);
      setLeads(localLeads);
      
      // Luego intentar sincronizar con la API
      const response = await apiService.getLeads(filters);
      if (response.success) {
        console.log('Leads sincronizados con la API');
      }
    } catch (error) {
      console.error('Error cargando leads:', error);
      // Mantener los datos locales si la API falla
      const localLeads = dataStore.getLeads(filters);
      setLeads(localLeads);
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (leadData: Partial<Lead>) => {
    setIsLoading(true);
    try {
      // Agregar localmente primero
      dataStore.addLead(leadData);
      
      // Intentar sincronizar con la API
      await apiService.createLead(leadData);
      
      toast({
        title: "Lead Agregado",
        description: "El lead ha sido sincronizado exitosamente",
      });
      
      // Recargar la lista
      await loadLeads();
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
      // Actualizar localmente
      dataStore.updateLead(id, updates);
      
      // Intentar sincronizar con la API
      await apiService.updateLead(id, updates);
      
      // Recargar la lista
      await loadLeads();
      
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

  const callLead = async (lead: Lead) => {
    try {
      await apiService.initiateCall(lead.phoneNumber, lead.assignedAgent);
      
      // Actualizar el contador de llamadas
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

  const getLeadsByStatus = () => {
    const statusCount = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return statusCount;
  };

  const getLeadsBySource = () => {
    const sourceCount = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return sourceCount;
  };

  const getHighPriorityLeads = () => {
    return leads.filter(lead => lead.priority >= 8 && lead.status === 'NEW');
  };

  useEffect(() => {
    loadLeads();
  }, [filters]);

  return {
    leads,
    isLoading,
    filters,
    setFilters,
    addLead,
    updateLead,
    callLead,
    getLeadsByStatus,
    getLeadsBySource,
    getHighPriorityLeads,
    refresh: loadLeads
  };
};
