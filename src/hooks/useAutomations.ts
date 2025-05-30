
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  conditions: any[];
  isActive: boolean;
  executionCount: number;
  successRate: number;
  lastExecution?: string;
  createdAt: string;
}

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar automatizaciones desde localStorage o API
    const savedAutomations = localStorage.getItem('ccd-automations');
    if (savedAutomations) {
      setAutomations(JSON.parse(savedAutomations));
    } else {
      // Inicializar con automatizaciones predeterminadas
      const defaultAutomations: AutomationRule[] = [
        {
          id: 'auto_001',
          name: 'Lead Scoring Automático',
          description: 'Asigna puntuación automática basada en fuente y datos demográficos',
          trigger: 'Nuevo lead ingresado',
          action: 'Calcular score y asignar prioridad',
          conditions: [
            { field: 'source', operator: 'equals', value: 'Meta Ads' },
            { field: 'priority', operator: 'greater_than', value: 7 }
          ],
          isActive: true,
          executionCount: 1247,
          successRate: 98.5,
          lastExecution: new Date().toISOString(),
          createdAt: '2025-05-01T00:00:00Z'
        },
        {
          id: 'auto_002',
          name: 'Distribución Inteligente',
          description: 'Asigna leads automáticamente al asesor más adecuado',
          trigger: 'Lead con score > 80',
          action: 'Asignar a asesor especializado',
          conditions: [
            { field: 'score', operator: 'greater_than', value: 80 },
            { field: 'status', operator: 'equals', value: 'NEW' }
          ],
          isActive: true,
          executionCount: 456,
          successRate: 94.2,
          lastExecution: new Date().toISOString(),
          createdAt: '2025-05-01T00:00:00Z'
        },
        {
          id: 'auto_003',
          name: 'Nurturing WhatsApp',
          description: 'Envía secuencia de mensajes personalizados',
          trigger: 'Lead sin contactar 24h',
          action: 'Enviar mensaje de seguimiento',
          conditions: [
            { field: 'last_contact', operator: 'older_than', value: '24h' },
            { field: 'status', operator: 'equals', value: 'NEW' }
          ],
          isActive: false,
          executionCount: 234,
          successRate: 76.3,
          createdAt: '2025-05-01T00:00:00Z'
        },
        {
          id: 'auto_004',
          name: 'Callback Reminder',
          description: 'Recuerda a asesores sobre callbacks programados',
          trigger: '15 min antes del callback',
          action: 'Notificar asesor + preparar información',
          conditions: [
            { field: 'callback_time', operator: 'in_next', value: '15min' }
          ],
          isActive: true,
          executionCount: 892,
          successRate: 99.1,
          lastExecution: new Date().toISOString(),
          createdAt: '2025-05-01T00:00:00Z'
        }
      ];
      
      setAutomations(defaultAutomations);
      localStorage.setItem('ccd-automations', JSON.stringify(defaultAutomations));
    }
  }, []);

  const saveAutomations = (newAutomations: AutomationRule[]) => {
    localStorage.setItem('ccd-automations', JSON.stringify(newAutomations));
    setAutomations(newAutomations);
  };

  const toggleAutomation = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedAutomations = automations.map(auto => 
        auto.id === id 
          ? { ...auto, isActive: !auto.isActive }
          : auto
      );
      
      saveAutomations(updatedAutomations);
      
      const automation = updatedAutomations.find(a => a.id === id);
      toast({
        title: "Automatización Actualizada",
        description: `${automation?.name} ${automation?.isActive ? 'activada' : 'pausada'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la automatización",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAutomation = async (automationData: Partial<AutomationRule>) => {
    setIsLoading(true);
    try {
      const newAutomation: AutomationRule = {
        id: `auto_${Date.now()}`,
        name: automationData.name || '',
        description: automationData.description || '',
        trigger: automationData.trigger || '',
        action: automationData.action || '',
        conditions: automationData.conditions || [],
        isActive: false,
        executionCount: 0,
        successRate: 0,
        createdAt: new Date().toISOString()
      };

      const updatedAutomations = [newAutomation, ...automations];
      saveAutomations(updatedAutomations);
      
      toast({
        title: "Automatización Creada",
        description: "Nueva automatización configurada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la automatización",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeAutomation = async (id: string) => {
    const automation = automations.find(a => a.id === id);
    if (!automation || !automation.isActive) return;

    try {
      // Simular ejecución de automatización
      console.log(`Ejecutando automatización: ${automation.name}`);
      
      // Actualizar contador de ejecuciones
      const updatedAutomations = automations.map(auto => 
        auto.id === id 
          ? { 
              ...auto, 
              executionCount: auto.executionCount + 1,
              lastExecution: new Date().toISOString()
            }
          : auto
      );
      
      saveAutomations(updatedAutomations);
      
      toast({
        title: "Automatización Ejecutada",
        description: `${automation.name} ejecutada exitosamente`,
      });
    } catch (error) {
      console.error('Error ejecutando automatización:', error);
    }
  };

  const getAutomationStats = () => {
    const activeCount = automations.filter(a => a.isActive).length;
    const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);
    const avgSuccessRate = automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length;
    
    return {
      total: automations.length,
      active: activeCount,
      totalExecutions,
      avgSuccessRate: Math.round(avgSuccessRate * 10) / 10
    };
  };

  // Simular ejecución automática de automatizaciones
  useEffect(() => {
    const interval = setInterval(() => {
      automations.forEach(automation => {
        if (automation.isActive && Math.random() < 0.1) { // 10% probabilidad por ciclo
          executeAutomation(automation.id);
        }
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [automations]);

  return {
    automations,
    isLoading,
    toggleAutomation,
    createAutomation,
    executeAutomation,
    getAutomationStats
  };
};
