
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Zap, MessageSquare, Clock, Target, TrendingUp, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  executionCount: number;
  successRate: number;
}

export const AutomationCenter = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: "auto_001",
      name: "Lead Scoring Automático",
      description: "Asigna puntuación automática basada en fuente y datos demográficos",
      trigger: "Nuevo lead ingresado",
      action: "Calcular score y asignar prioridad",
      isActive: true,
      executionCount: 1247,
      successRate: 98.5
    },
    {
      id: "auto_002", 
      name: "Distribución Inteligente",
      description: "Asigna leads automáticamente al asesor más adecuado",
      trigger: "Lead con score > 80",
      action: "Asignar a asesor especializado",
      isActive: true,
      executionCount: 456,
      successRate: 94.2
    },
    {
      id: "auto_003",
      name: "Nurturing WhatsApp",
      description: "Envía secuencia de mensajes personalizados",
      trigger: "Lead sin contactar 24h",
      action: "Enviar mensaje de seguimiento",
      isActive: false,
      executionCount: 234,
      successRate: 76.3
    },
    {
      id: "auto_004",
      name: "Callback Reminder",
      description: "Recuerda a asesores sobre callbacks programados",
      trigger: "15 min antes del callback",
      action: "Notificar asesor + preparar información",
      isActive: true,
      executionCount: 892,
      successRate: 99.1
    }
  ]);

  const [aiRecommendations] = useState([
    {
      type: "optimization",
      title: "Optimizar horario de llamadas",
      description: "Los leads de Meta tienen 35% más conversión entre 10-12 AM",
      impact: "alto",
      estimated_improvement: "+15% conversión"
    },
    {
      type: "automation",
      title: "Crear regla de reasignación",
      description: "Leads sin contactar en 4h deberían reasignarse automáticamente",
      impact: "medio",
      estimated_improvement: "+8% contacto"
    },
    {
      type: "campaign",
      title: "Pausar fuente poco rentable",
      description: "TikTok Ads tiene ROI 40% inferior en últimos 7 días",
      impact: "alto",
      estimated_improvement: "-$2,500 costo"
    }
  ]);

  const { toast } = useToast();

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { ...auto, isActive: !auto.isActive }
        : auto
    ));
    
    toast({
      title: "Automatización Actualizada",
      description: "El estado de la automatización ha sido modificado",
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'bg-red-500';
      case 'medio': return 'bg-yellow-500';
      case 'bajo': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Centro de Automatización e IA</h2>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Nueva Automatización
        </Button>
      </div>

      {/* Métricas de Automatización */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automatizaciones Activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.filter(a => a.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              de {automations.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecuciones Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,829</div>
            <p className="text-xs text-muted-foreground">
              +12% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-muted-foreground">
              Promedio general
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Ahorrado</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47h</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Automatizaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Automatizaciones Configuradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={automation.isActive}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <div>
                    <h3 className="font-medium">{automation.name}</h3>
                    <p className="text-sm text-gray-600">{automation.description}</p>
                  </div>
                </div>
                <Badge variant={automation.isActive ? "default" : "secondary"}>
                  {automation.isActive ? "Activa" : "Pausada"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Trigger:</p>
                  <p className="font-medium">{automation.trigger}</p>
                </div>
                <div>
                  <p className="text-gray-600">Acción:</p>
                  <p className="font-medium">{automation.action}</p>
                </div>
                <div>
                  <p className="text-gray-600">Estadísticas:</p>
                  <p className="font-medium">
                    {automation.executionCount} ejecuciones ({automation.successRate}% éxito)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recomendaciones de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Recomendaciones de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{recommendation.title}</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getImpactColor(recommendation.impact)} text-white`}>
                    Impacto {recommendation.impact}
                  </Badge>
                  <Badge variant="outline">
                    {recommendation.estimated_improvement}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
              <div className="flex space-x-2">
                <Button size="sm">Implementar</Button>
                <Button size="sm" variant="outline">Ver Detalles</Button>
                <Button size="sm" variant="ghost">Descartar</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
