
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, AlertCircle, Eye, UserCheck, Clock } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useAdvisorPerformance } from '@/hooks/useAdvisorPerformance';
import { useRealTimeAdvisorTracking } from '@/hooks/useRealTimeAdvisorTracking';
import { AdvisorAlerts } from './AdvisorAlerts';

export const SupervisorDashboard = () => {
  const { user } = useAuthContext();
  const { advisors } = useAdvisorPerformance();
  const { realTimeMetrics, startTracking, stopTracking, isTracking } = useRealTimeAdvisorTracking();
  
  // Filtrar asesores del equipo (simulado)
  const teamAdvisors = advisors.filter(advisor => advisor.campaign === 'Ventas Premium');
  
  const teamStats = {
    totalAdvisors: teamAdvisors.length,
    activeAdvisors: teamAdvisors.filter(a => a.status === 'ACTIVE').length,
    totalCallsToday: teamAdvisors.reduce((sum, a) => sum + a.callsToday, 0),
    totalSalesToday: teamAdvisors.reduce((sum, a) => sum + a.salesToday, 0),
    avgQuality: Math.round(teamAdvisors.reduce((sum, a) => sum + a.qualityScore, 0) / teamAdvisors.length),
    avgConversion: teamAdvisors.reduce((sum, a) => sum + a.conversionRate, 0) / teamAdvisors.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'BREAK': return 'bg-yellow-100 text-yellow-800';
      case 'OFFLINE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del supervisor */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Supervisor</h1>
            <p className="text-green-100">
              {user?.name} - Equipo: {user?.teamId || 'Ventas A'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex space-x-2 mb-2">
              <Button
                onClick={isTracking ? stopTracking : startTracking}
                variant={isTracking ? "secondary" : "default"}
                size="sm"
              >
                {isTracking ? 'Detener' : 'Iniciar'} Monitoreo
              </Button>
            </div>
            <p className="text-sm">
              Último Update: {new Date(realTimeMetrics.lastUpdate).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="team">Mi Equipo</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          {/* Estadísticas del equipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asesores Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamStats.activeAdvisors}/{teamStats.totalAdvisors}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((teamStats.activeAdvisors / teamStats.totalAdvisors) * 100)}% disponibles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Llamadas del Equipo</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats.totalCallsToday}</div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {Math.round(teamStats.totalCallsToday / teamStats.totalAdvisors)} por asesor
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas del Equipo</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats.totalSalesToday}</div>
                <p className="text-xs text-muted-foreground">
                  Conversión: {teamStats.avgConversion.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calidad Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats.avgQuality}%</div>
                <p className="text-xs text-muted-foreground">
                  Objetivo: 85%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de asesores del equipo */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Equipo en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamAdvisors.map((advisor) => (
                  <div key={advisor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <h4 className="font-medium">{advisor.name}</h4>
                        <p className="text-sm text-muted-foreground">{advisor.campaign}</p>
                      </div>
                      <Badge className={getStatusColor(advisor.status)}>
                        {advisor.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{advisor.callsToday}</p>
                        <p className="text-muted-foreground">Llamadas</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{advisor.salesToday}</p>
                        <p className="text-muted-foreground">Ventas</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{advisor.qualityScore}%</p>
                        <p className="text-muted-foreground">Calidad</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamAdvisors
                    .sort((a, b) => b.salesToday - a.salesToday)
                    .slice(0, 5)
                    .map((advisor, index) => (
                    <div key={advisor.id} className="flex items-center justify-between p-2 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{advisor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {advisor.salesToday} ventas - {advisor.conversionRate}%
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{advisor.qualityScore}% calidad</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asesores que Necesitan Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamAdvisors
                    .filter(advisor => advisor.qualityScore < 70 || advisor.callsToday < 20)
                    .map((advisor) => (
                    <div key={advisor.id} className="flex items-center justify-between p-3 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                      <div>
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {advisor.callsToday < 20 ? `Solo ${advisor.callsToday} llamadas` : ''}
                          {advisor.qualityScore < 70 ? ` - Calidad baja: ${advisor.qualityScore}%` : ''}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Asistir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Monitoreo en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Asesores Activos:</span>
                    <span className="font-medium">{realTimeMetrics.activeAdvisors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Llamadas en Progreso:</span>
                    <span className="font-medium">{realTimeMetrics.totalCallsInProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo Promedio:</span>
                    <span className="font-medium">{realTimeMetrics.averageCallDuration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carga del Sistema:</span>
                    <span className="font-medium">{realTimeMetrics.systemLoad}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control de Pausas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamAdvisors
                    .filter(advisor => advisor.status === 'BREAK')
                    .map((advisor) => (
                    <div key={advisor.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Pausa desde: {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Asignar Leads
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Monitorear Llamada
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Revisión de Calidad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <AdvisorAlerts />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generación de Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 justify-start flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Reporte de Rendimiento Diario
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <Users className="h-6 w-6 mb-2" />
                  Reporte de Asistencia
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <UserCheck className="h-6 w-6 mb-2" />
                  Reporte de Calidad
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <Clock className="h-6 w-6 mb-2" />
                  Reporte de Productividad
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
