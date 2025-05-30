
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
  Users, 
  TrendingUp, 
  Phone, 
  Clock, 
  Target, 
  Award, 
  AlertTriangle,
  Star,
  Eye,
  BarChart3
} from "lucide-react";
import { useAdvisorPerformance } from "@/hooks/useAdvisorPerformance";

export const AdvisorPerformance = () => {
  const {
    advisors,
    qualityReviews,
    isLoading,
    selectedAdvisor,
    setSelectedAdvisor,
    updateAdvisorStatus,
    createQualityReview,
    getTopPerformers,
    getLowPerformers,
    getTeamStats
  } = useAdvisorPerformance();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isQualityReviewOpen, setIsQualityReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState<any>({});

  const teamStats = getTeamStats();
  const topPerformers = getTopPerformers();
  const lowPerformers = getLowPerformers();

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

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 80) return 'text-blue-600 font-medium';
    if (score >= 70) return 'text-yellow-600 font-medium';
    return 'text-red-600 font-bold';
  };

  const handleCreateQualityReview = async () => {
    if (!newReview.advisorId || !newReview.callId) return;

    await createQualityReview({
      ...newReview,
      reviewerId: 'supervisor_001', // ID del supervisor actual
      date: new Date().toISOString(),
      status: 'REVIEWED'
    });

    setNewReview({});
    setIsQualityReviewOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* KPIs del Equipo */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Asesores</p>
                <p className="text-2xl font-bold">{teamStats.totalAdvisors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos Ahora</p>
                <p className="text-2xl font-bold text-green-600">{teamStats.activeAdvisors}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calidad Promedio</p>
                <p className="text-2xl font-bold">{teamStats.avgQuality}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Llamadas Hoy</p>
                <p className="text-2xl font-bold">{teamStats.totalCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversión Equipo</p>
                <p className="text-2xl font-bold">{teamStats.avgConversion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top y Low Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Award className="h-5 w-5 mr-2" />
              Top Performers del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.slice(0, 5).map((advisor, index) => (
                <div key={advisor.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-gold text-white">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{advisor.name}</p>
                      <p className="text-sm text-gray-600">{advisor.campaign}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{advisor.qualityScore}%</p>
                    <p className="text-sm">{advisor.salesToday} ventas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowPerformers.slice(0, 5).map((advisor) => (
                <div key={advisor.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">{advisor.name}</p>
                    <p className="text-sm text-gray-600">{advisor.campaign}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{advisor.qualityScore}%</p>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel Principal de Asesores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Monitoreo de Asesores ({advisors.length})
              {isLoading && <span className="ml-2 text-sm text-gray-500">Actualizando...</span>}
            </div>
            <div className="flex space-x-2">
              <Select value={viewMode} onValueChange={(value: 'grid' | 'table') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Tarjetas</SelectItem>
                  <SelectItem value="table">Tabla</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isQualityReviewOpen} onOpenChange={setIsQualityReviewOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Star className="h-4 w-4 mr-2" />
                    Nueva Evaluación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Evaluación de Calidad</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Asesor</Label>
                      <Select onValueChange={(value) => setNewReview({...newReview, advisorId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar asesor" />
                        </SelectTrigger>
                        <SelectContent>
                          {advisors.map((advisor) => (
                            <SelectItem key={advisor.id} value={advisor.id}>
                              {advisor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>ID de Llamada</Label>
                      <Input
                        value={newReview.callId || ""}
                        onChange={(e) => setNewReview({...newReview, callId: e.target.value})}
                        placeholder="Ej: CALL_12345"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Saludo (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newReview.scores?.greeting || ""}
                          onChange={(e) => setNewReview({
                            ...newReview, 
                            scores: {...newReview.scores, greeting: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label>Conocimiento (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newReview.scores?.productKnowledge || ""}
                          onChange={(e) => setNewReview({
                            ...newReview, 
                            scores: {...newReview.scores, productKnowledge: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label>Objeciones (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newReview.scores?.objectionHandling || ""}
                          onChange={(e) => setNewReview({
                            ...newReview, 
                            scores: {...newReview.scores, objectionHandling: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label>Cierre (1-100)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newReview.scores?.closing || ""}
                          onChange={(e) => setNewReview({
                            ...newReview, 
                            scores: {...newReview.scores, closing: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Comentarios</Label>
                      <Textarea
                        value={newReview.comments || ""}
                        onChange={(e) => setNewReview({...newReview, comments: e.target.value})}
                        placeholder="Observaciones detalladas de la llamada..."
                      />
                    </div>
                    
                    <Button onClick={handleCreateQualityReview} className="w-full" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Evaluación"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advisors.map((advisor) => (
                <Card key={advisor.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{advisor.name}</CardTitle>
                        <p className="text-sm text-gray-600">{advisor.campaign}</p>
                      </div>
                      <Badge className={`${getStatusColor(advisor.status)} text-white`}>
                        {advisor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score de Calidad */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calidad</span>
                        <span className={getQualityColor(advisor.qualityScore)}>
                          {advisor.qualityScore}%
                        </span>
                      </div>
                      <Progress value={advisor.qualityScore} className="h-2" />
                    </div>

                    {/* Métricas del día */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-gray-600">Llamadas</p>
                        <p className="font-bold text-lg">{advisor.callsToday}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-gray-600">Ventas</p>
                        <p className="font-bold text-lg text-green-600">{advisor.salesToday}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <p className="text-gray-600">Conversión</p>
                        <p className="font-bold text-lg text-purple-600">{advisor.conversionRate}%</p>
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <p className="text-gray-600">Duración Prom.</p>
                        <p className="font-bold text-lg">{Math.round(advisor.avgCallDuration / 60)}m</p>
                      </div>
                    </div>

                    {/* Ranking */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Ranking del día:</span>
                      <Badge variant="outline">#{advisor.ranking}</Badge>
                    </div>

                    {/* Acciones */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedAdvisor(advisor.id)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setNewReview({advisorId: advisor.id});
                          setIsQualityReviewOpen(true);
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Asesor</th>
                    <th className="text-left p-3">Estado</th>
                    <th className="text-right p-3">Calidad</th>
                    <th className="text-right p-3">Llamadas</th>
                    <th className="text-right p-3">Ventas</th>
                    <th className="text-right p-3">Conversión</th>
                    <th className="text-right p-3">Tiempo Productivo</th>
                    <th className="text-center p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {advisors.map((advisor) => (
                    <tr key={advisor.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{advisor.name}</p>
                          <p className="text-sm text-gray-600">{advisor.campaign}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(advisor.status)} text-white text-xs`}>
                          {advisor.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <span className={getQualityColor(advisor.qualityScore)}>
                          {advisor.qualityScore}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">{advisor.callsToday}</td>
                      <td className="p-3 text-right font-medium text-green-600">{advisor.salesToday}</td>
                      <td className="p-3 text-right font-medium">{advisor.conversionRate}%</td>
                      <td className="p-3 text-right">{Math.round(advisor.productiveTime / 60)}h</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
