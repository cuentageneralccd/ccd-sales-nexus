
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Users, 
  Phone, 
  Clock, 
  TrendingUp, 
  Play,
  Pause,
  BarChart3,
  AlertCircle,
  Zap
} from "lucide-react";
import { useRealTimeAdvisorTracking } from "@/hooks/useRealTimeAdvisorTracking";

export const RealTimeAdvisorDashboard = () => {
  const {
    realTimeMetrics,
    recentActivities,
    isTracking,
    startTracking,
    stopTracking,
    getAdvisorsByStatus,
    getTopPerformersRealTime,
    getAlertsCount
  } = useRealTimeAdvisorTracking();

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const advisorsByStatus = getAdvisorsByStatus();
  const topPerformers = getTopPerformersRealTime();
  const alertsCount = getAlertsCount();

  useEffect(() => {
    setLastUpdate(new Date());
  }, [realTimeMetrics]);

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'CALL_START': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'CALL_END': return <Phone className="h-4 w-4 text-gray-600" />;
      case 'SALE_COMPLETED': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'BREAK_START': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'BREAK_END': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'CALL_START': return 'Llamada iniciada';
      case 'CALL_END': return 'Llamada finalizada';
      case 'SALE_COMPLETED': return 'Venta completada';
      case 'BREAK_START': return 'Descanso iniciado';
      case 'BREAK_END': return 'Descanso finalizado';
      case 'LOGIN': return 'Ingreso al sistema';
      case 'LOGOUT': return 'Salida del sistema';
      default: return activity;
    }
  };

  const getSystemLoadColor = (load: number) => {
    if (load < 70) return 'text-green-600';
    if (load < 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Monitor en Tiempo Real
              {isTracking && (
                <Badge className="ml-3 bg-green-500 text-white animate-pulse">
                  EN VIVO
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                onClick={isTracking ? stopTracking : startTracking}
                variant={isTracking ? "destructive" : "default"}
                size="sm"
              >
                {isTracking ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Asesores Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.activeAdvisors}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Llamadas en Curso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.totalCallsInProgress}
                </p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duración Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(realTimeMetrics.averageCallDuration / 60)}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversión Actual</p>
                <p className="text-2xl font-bold text-orange-600">
                  {realTimeMetrics.currentConversionRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Carga del Sistema</p>
                <p className={`text-2xl font-bold ${getSystemLoadColor(realTimeMetrics.systemLoad)}`}>
                  {realTimeMetrics.systemLoad}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <Progress value={realTimeMetrics.systemLoad} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Asesores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Estado de Asesores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(advisorsByStatus).map(([status, count]) => {
                const colors = {
                  ACTIVE: 'bg-green-500',
                  BREAK: 'bg-yellow-500',
                  LUNCH: 'bg-orange-500',
                  TRAINING: 'bg-blue-500',
                  OFFLINE: 'bg-gray-500'
                };
                
                return (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`}></div>
                      <span className="font-medium">{status}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers en Tiempo Real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performers Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((advisor, index) => (
                <div key={advisor.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-gold text-white">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{advisor.name}</p>
                      <p className="text-sm text-gray-600">{advisor.campaign}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{advisor.salesToday} ventas</p>
                    <p className="text-sm">{advisor.qualityScore}% calidad</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad en Tiempo Real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Actividad en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay actividad reciente</p>
                  <p className="text-sm">Inicia el monitoreo para ver actualizaciones</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.activity)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {activity.details?.advisorName || `Asesor ${activity.advisorId}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getActivityLabel(activity.activity)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel de Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Centro de Alertas
              </div>
              {alertsCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {alertsCount} activas
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{alertsCount}</p>
                  <p className="text-sm text-gray-600">Alertas Activas</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round((alertsCount / (advisorsByStatus.ACTIVE || 1)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Tasa de Alertas</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rendimiento Bajo</span>
                  <Badge variant="destructive">{Math.floor(alertsCount * 0.4)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inactividad</span>
                  <Badge variant="secondary">{Math.floor(alertsCount * 0.3)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Calidad</span>
                  <Badge variant="outline">{Math.floor(alertsCount * 0.3)}</Badge>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Ver Todas las Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
