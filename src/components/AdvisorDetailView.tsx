
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  Phone, 
  Clock, 
  Target, 
  TrendingUp, 
  Activity,
  BarChart3,
  Star,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAdvisorPerformance } from "@/hooks/useAdvisorPerformance";

interface AdvisorDetailViewProps {
  advisorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorDetailView = ({ advisorId, isOpen, onClose }: AdvisorDetailViewProps) => {
  const { advisors, qualityReviews } = useAdvisorPerformance();
  const [advisor, setAdvisor] = useState<any>(null);
  const [advisorReviews, setAdvisorReviews] = useState<any[]>([]);

  useEffect(() => {
    if (advisorId) {
      const found = advisors.find(a => a.id === advisorId);
      setAdvisor(found);
      
      const reviews = qualityReviews.filter(r => r.advisorId === advisorId);
      setAdvisorReviews(reviews);
    }
  }, [advisorId, advisors, qualityReviews]);

  if (!advisor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'BREAK': return 'bg-yellow-500';
      case 'LUNCH': return 'bg-orange-500';
      case 'TRAINING': return 'bg-blue-500';
      case 'OFFLINE': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excelente', color: 'text-green-600' };
    if (score >= 80) return { level: 'Bueno', color: 'text-blue-600' };
    if (score >= 70) return { level: 'Promedio', color: 'text-yellow-600' };
    return { level: 'Necesita Mejora', color: 'text-red-600' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <User className="h-6 w-6" />
            <div>
              <span>{advisor.name}</span>
              <Badge className={`ml-3 ${getStatusColor(advisor.status)} text-white`}>
                {advisor.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="quality">Calidad</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Asesor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{advisor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Campaña</p>
                    <p className="font-medium">{advisor.campaign}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Turno</p>
                    <p className="font-medium">{advisor.shift}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ranking</p>
                    <p className="font-medium">#{advisor.ranking}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs Principales */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Llamadas Hoy</p>
                      <p className="text-2xl font-bold">{advisor.callsToday}</p>
                    </div>
                    <Phone className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ventas Hoy</p>
                      <p className="text-2xl font-bold text-green-600">{advisor.salesToday}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversión</p>
                      <p className="text-2xl font-bold">{advisor.conversionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Calidad</p>
                      <p className={`text-2xl font-bold ${getPerformanceLevel(advisor.qualityScore).color}`}>
                        {advisor.qualityScore}%
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tiempo y Productividad */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Tiempo y Productividad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tiempo Productivo</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatDuration(advisor.productiveTime)}
                    </p>
                    <Progress value={(advisor.productiveTime / 28800) * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tiempo en Descanso</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatDuration(advisor.breakTime)}
                    </p>
                    <Progress value={(advisor.breakTime / 3600) * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tiempo Inactivo</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatDuration(advisor.idleTime)}
                    </p>
                    <Progress value={(advisor.idleTime / 3600) * 100} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Métricas de Rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Tasa de Contacto</span>
                        <span className="font-bold">{((advisor.contactsToday / advisor.callsToday) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(advisor.contactsToday / advisor.callsToday) * 100} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Tasa de Citas</span>
                        <span className="font-bold">{advisor.appointmentRate}%</span>
                      </div>
                      <Progress value={advisor.appointmentRate} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Tasa de Seguimiento</span>
                        <span className="font-bold">{advisor.followUpRate}%</span>
                      </div>
                      <Progress value={advisor.followUpRate} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Duración Promedio de Llamada</p>
                      <p className="text-xl font-bold text-blue-600">
                        {Math.round(advisor.avgCallDuration / 60)} minutos
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Tiempo Total en Llamadas</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatDuration(advisor.totalCallTime)}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Tiempo de Respuesta Promedio</p>
                      <p className="text-xl font-bold text-purple-600">
                        {Math.round(advisor.avgResponseTime / 60)} minutos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{advisor.leadsAssigned}</p>
                    <p className="text-sm text-gray-600">Leads Asignados</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{advisor.leadsContacted}</p>
                    <p className="text-sm text-gray-600">Leads Contactados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{advisor.leadsConverted}</p>
                    <p className="text-sm text-gray-600">Leads Convertidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            {/* Puntuaciones de Calidad */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluación de Calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Puntuación General</span>
                        <span className={`font-bold ${getPerformanceLevel(advisor.qualityScore).color}`}>
                          {advisor.qualityScore}%
                        </span>
                      </div>
                      <Progress value={advisor.qualityScore} />
                      <p className={`text-sm ${getPerformanceLevel(advisor.qualityScore).color} mt-1`}>
                        {getPerformanceLevel(advisor.qualityScore).level}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Satisfacción del Cliente</span>
                        <span className="font-bold">{advisor.customerSatisfaction}%</span>
                      </div>
                      <Progress value={advisor.customerSatisfaction} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Cumplimiento de Script</span>
                        <span className="font-bold">{advisor.scriptCompliance}%</span>
                      </div>
                      <Progress value={advisor.scriptCompliance} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Manejo de Objeciones</span>
                        <span className="font-bold">{advisor.objectionHandling}%</span>
                      </div>
                      <Progress value={advisor.objectionHandling} />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Últimas Evaluaciones</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {advisorReviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                            <Badge variant={review.status === 'REVIEWED' ? 'default' : 'secondary'}>
                              {review.status}
                            </Badge>
                          </div>
                          {review.scores && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Saludo: {review.scores.greeting}</div>
                              <div>Conocimiento: {review.scores.productKnowledge}</div>
                              <div>Objeciones: {review.scores.objectionHandling}</div>
                              <div>Cierre: {review.scores.closing}</div>
                            </div>
                          )}
                          {review.comments && (
                            <p className="text-sm text-gray-600 mt-2">{review.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Venta Completada</p>
                      <p className="text-sm text-gray-600">Hace 15 minutos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Llamada Completada</p>
                      <p className="text-sm text-gray-600">Hace 23 minutos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Cita Programada</p>
                      <p className="text-sm text-gray-600">Hace 1 hora</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Llamada No Contestada</p>
                      <p className="text-sm text-gray-600">Hace 1.5 horas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Reportes y Análisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Tendencias Semanales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Llamadas esta semana:</span>
                        <span className="font-bold">{advisor.callsWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promedio diario:</span>
                        <span className="font-bold">{Math.round(advisor.callsWeek / 7)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mejora vs semana anterior:</span>
                        <span className="font-bold text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Metas del Mes</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Llamadas ({advisor.callsMonth}/1600)</span>
                          <span>{Math.round((advisor.callsMonth / 1600) * 100)}%</span>
                        </div>
                        <Progress value={(advisor.callsMonth / 1600) * 100} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ventas (45/60)</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button variant="outline">
                    Exportar Reporte Completo
                  </Button>
                  <Button variant="outline">
                    Generar Análisis Detallado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
