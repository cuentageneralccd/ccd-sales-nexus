
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Plus,
  Calendar,
  MessageSquare,
  Gift,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useLeadClassification } from "@/hooks/useLeadClassification";

export const LeadClassificationPanel = () => {
  const {
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
    getOverdueTasks
  } = useLeadClassification();

  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [newObservation, setNewObservation] = useState<any>({});
  const [newTask, setNewTask] = useState<any>({});

  const stageStats = getLeadsByStage();
  const conversionFunnel = getConversionFunnel();
  const overdueTasks = getOverdueTasks();

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'NEW': return 'bg-blue-500';
      case 'CONTACTED': return 'bg-purple-500';
      case 'QUALIFIED': return 'bg-green-500';
      case 'PRESENTATION': return 'bg-orange-500';
      case 'PROPOSAL': return 'bg-yellow-500';
      case 'NEGOTIATION': return 'bg-red-500';
      case 'CLOSED_WON': return 'bg-emerald-500';
      case 'CLOSED_LOST': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HOT': return 'text-red-600 font-bold';
      case 'WARM': return 'text-orange-600 font-medium';
      case 'COLD': return 'text-blue-600';
      case 'QUALIFIED': return 'text-green-600 font-bold';
      case 'UNQUALIFIED': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleAddObservation = async () => {
    if (!selectedLead || !newObservation.content) return;

    await addObservation(selectedLead, {
      ...newObservation,
      date: new Date().toISOString(),
      advisorId: 'current_advisor', // ID del asesor actual
      completed: false
    });

    setNewObservation({});
    setIsObservationOpen(false);
  };

  const handleCreateTask = async () => {
    if (!selectedLead || !newTask.title) return;

    await createFollowUpTask({
      ...newTask,
      leadId: selectedLead,
      advisorId: 'current_advisor', // ID del asesor actual
      status: 'PENDING'
    });

    setNewTask({});
    setIsTaskOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Funnel de Conversión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Embudo de Conversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="text-center">
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto rounded-full ${getStageColor(stage.stage)} text-white flex items-center justify-center font-bold text-sm mb-2`}>
                    {stage.count}
                  </div>
                  {index < conversionFunnel.length - 1 && (
                    <ArrowRight className="absolute top-6 -right-4 h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-xs font-medium">{stage.stage.replace('_', ' ')}</p>
                <p className="text-xs text-gray-600">{stage.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Activos</p>
                <p className="text-2xl font-bold">{classifications.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {classifications.filter(c => c.leadType === 'HOT').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tareas Vencidas</p>
                <p className="text-2xl font-bold text-orange-600">{overdueTasks.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold text-green-600">
                  {classifications.length > 0 ? 
                    Math.round((stageStats.CLOSED_WON || 0) / classifications.length * 100) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Clasificación y Seguimiento de Leads
              {isLoading && <span className="ml-2 text-sm text-gray-500">Actualizando...</span>}
            </div>
            <div className="flex space-x-2">
              <Dialog open={isObservationOpen} onOpenChange={setIsObservationOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedLead}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Nueva Observación
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Observación</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Actividad</Label>
                      <Select onValueChange={(value) => setNewObservation({...newObservation, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CALL">Llamada</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="MEETING">Reunión</SelectItem>
                          <SelectItem value="NOTE">Nota</SelectItem>
                          <SelectItem value="TASK">Tarea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Prioridad</Label>
                      <Select onValueChange={(value) => setNewObservation({...newObservation, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Baja</SelectItem>
                          <SelectItem value="MEDIUM">Media</SelectItem>
                          <SelectItem value="HIGH">Alta</SelectItem>
                          <SelectItem value="URGENT">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Contenido</Label>
                      <Textarea
                        value={newObservation.content || ""}
                        onChange={(e) => setNewObservation({...newObservation, content: e.target.value})}
                        placeholder="Describe la actividad o notas importantes..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label>Fecha de Seguimiento (opcional)</Label>
                      <Input
                        type="datetime-local"
                        value={newObservation.followUpDate || ""}
                        onChange={(e) => setNewObservation({...newObservation, followUpDate: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleAddObservation} className="w-full" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Agregar Observación"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedLead}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Nueva Tarea
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Tarea de Seguimiento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Tarea</Label>
                      <Select onValueChange={(value) => setNewTask({...newTask, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CALL">Llamada de seguimiento</SelectItem>
                          <SelectItem value="EMAIL">Enviar email</SelectItem>
                          <SelectItem value="MEETING">Agendar reunión</SelectItem>
                          <SelectItem value="QUOTE">Enviar cotización</SelectItem>
                          <SelectItem value="PRESENTATION">Preparar presentación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={newTask.title || ""}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Ej: Llamada de seguimiento post-demo"
                      />
                    </div>
                    
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={newTask.description || ""}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Detalles adicionales de la tarea..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Fecha Programada</Label>
                        <Input
                          type="datetime-local"
                          value={newTask.scheduledDate || ""}
                          onChange={(e) => setNewTask({...newTask, scheduledDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Prioridad</Label>
                        <Select onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Baja</SelectItem>
                            <SelectItem value="MEDIUM">Media</SelectItem>
                            <SelectItem value="HIGH">Alta</SelectItem>
                            <SelectItem value="URGENT">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button onClick={handleCreateTask} className="w-full" disabled={isLoading}>
                      {isLoading ? "Creando..." : "Crear Tarea"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {classifications.map((classification) => (
              <Card 
                key={classification.id} 
                className={`cursor-pointer transition-all ${
                  selectedLead === classification.leadId ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedLead(classification.leadId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Lead ID: {classification.leadId}</CardTitle>
                      <p className="text-sm text-gray-600">Asesor: {classification.advisorId}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={`${getStageColor(classification.currentStage)} text-white text-xs`}>
                        {classification.currentStage}
                      </Badge>
                      <span className={`text-sm ${getTypeColor(classification.leadType)}`}>
                        {classification.leadType}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Progress de la etapa */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso del Pipeline</span>
                      <span>{classification.stageHistory.length}/8 etapas</span>
                    </div>
                    <Progress 
                      value={(classification.stageHistory.length / 8) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Métricas clave */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-gray-600">Interés</p>
                      <p className="font-bold">{classification.interest_level}/10</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-gray-600">Presupuesto</p>
                      <p className="font-bold">{classification.budget_range}</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded">
                      <p className="text-gray-600">Timeline</p>
                      <p className="font-bold text-xs">{classification.decision_timeline}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-gray-600">Autoridad</p>
                      <p className="font-bold text-xs">{classification.authority_level}</p>
                    </div>
                  </div>

                  {/* Observaciones recientes */}
                  <div>
                    <p className="text-sm font-medium mb-2">Últimas Observaciones:</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {classification.observations.slice(-2).map((obs) => (
                        <div key={obs.id} className="text-xs p-2 bg-gray-50 rounded">
                          <div className="flex justify-between">
                            <Badge variant="outline" className="text-xs">{obs.type}</Badge>
                            <span className="text-gray-500">{new Date(obs.date).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-1 truncate">{obs.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promociones activas */}
                  {classification.promotions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        Promociones:
                      </p>
                      <div className="space-y-1">
                        {classification.promotions.slice(0, 2).map((promo) => (
                          <div key={promo.id} className="text-xs p-2 bg-yellow-50 rounded border border-yellow-200">
                            <div className="flex justify-between">
                              <span className="font-medium">{promo.name}</span>
                              <Badge 
                                variant={promo.status === 'ACCEPTED' ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {promo.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600">Descuento: {promo.discount}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Próxima acción */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">Próximo contacto:</p>
                    <p className="text-sm font-medium">{new Date(classification.nextContactDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {classifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay leads clasificados aún</p>
              <p className="text-sm">Los leads aparecerán aquí una vez que sean clasificados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de Tareas Pendientes */}
      {overdueTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Clock className="h-5 w-5 mr-2" />
              Tareas Vencidas ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">Lead: {task.leadId}</p>
                    <p className="text-xs text-orange-600">
                      Vencida: {new Date(task.scheduledDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Completar
                    </Button>
                    <Button size="sm" variant="outline">
                      Reprogramar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
