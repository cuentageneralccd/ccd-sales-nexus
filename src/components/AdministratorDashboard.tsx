
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Users, Database, BarChart, Shield, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { SystemMonitor } from './SystemMonitor';
import { FinancialDashboard } from './FinancialDashboard';

export const AdministratorDashboard = () => {
  const { user } = useAuthContext();
  const { stats, isConnected } = useRealTimeData();
  
  const systemHealth = {
    database: 98,
    api: 99,
    vicidial: 95,
    calls: 97
  };

  const globalStats = {
    totalUsers: 156,
    activeCampaigns: 8,
    monthlyRevenue: 284500,
    systemUptime: 99.8
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const recentActivities = [
    { type: 'user', message: 'Nuevo usuario registrado: Carlos Pérez', time: '10:30 AM' },
    { type: 'system', message: 'Backup automático completado', time: '09:00 AM' },
    { type: 'campaign', message: 'Campaña "Ventas Q4" activada', time: '08:45 AM' },
    { type: 'alert', message: 'Alerta de rendimiento en servidor DB2', time: '08:30 AM' }
  ];

  return (
    <div className="space-y-6">
      {/* Header del administrador */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administrador</h1>
            <p className="text-purple-100">
              {user?.name} - Control Total del Sistema
            </p>
          </div>
          <div className="text-right">
            <Badge className={`mb-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
              Sistema {isConnected ? 'Online' : 'Offline'}
            </Badge>
            <p className="text-sm">
              Uptime: {globalStats.systemUptime}%
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeAgents} activos ahora
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalStats.activeCampaigns}</div>
                <p className="text-xs text-muted-foreground">
                  3 nuevas esta semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${globalStats.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime del Sistema</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalStats.systemUptime}%</div>
                <p className="text-xs text-muted-foreground">
                  Último reinicio: 2 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estado del sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Estado de Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Base de Datos</span>
                    </div>
                    <Badge className={getHealthColor(systemHealth.database)}>
                      {systemHealth.database}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart className="h-4 w-4" />
                      <span>API Gateway</span>
                    </div>
                    <Badge className={getHealthColor(systemHealth.api)}>
                      {systemHealth.api}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Vicidial</span>
                    </div>
                    <Badge className={getHealthColor(systemHealth.vicidial)}>
                      {systemHealth.vicidial}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Sistema de Llamadas</span>
                    </div>
                    <Badge className={getHealthColor(systemHealth.calls)}>
                      {systemHealth.calls}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        activity.type === 'alert' ? 'bg-red-500' :
                        activity.type === 'system' ? 'bg-green-500' :
                        activity.type === 'user' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Asesores</span>
                    <Badge>120</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Supervisores</span>
                    <Badge>24</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Administradores</span>
                    <Badge>12</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Online</span>
                    <Badge className="bg-green-100 text-green-800">{stats.activeAgents}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>En pausa</span>
                    <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Offline</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {globalStats.totalUsers - stats.activeAgents - 8}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Gestionar Permisos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Auditoría de Acceso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <SystemMonitor />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Ejecutivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <BarChart className="h-6 w-6 mb-2" />
                  <span>Reporte Ejecutivo</span>
                  <span className="text-xs text-muted-foreground">Mensual</span>
                </Button>
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Análisis Financiero</span>
                  <span className="text-xs text-muted-foreground">Trimestral</span>
                </Button>
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Rendimiento Global</span>
                  <span className="text-xs text-muted-foreground">Anual</span>
                </Button>
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>Métricas de Sistema</span>
                  <span className="text-xs text-muted-foreground">Diario</span>
                </Button>
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <Shield className="h-6 w-6 mb-2" />
                  <span>Auditoría</span>
                  <span className="text-xs text-muted-foreground">Semanal</span>
                </Button>
                <Button className="h-24 justify-start flex-col" variant="outline">
                  <Database className="h-6 w-6 mb-2" />
                  <span>Backup & Restore</span>
                  <span className="text-xs text-muted-foreground">Automático</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración General
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Base de Datos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Integración Vicidial
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Seguridad
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Manual
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Limpiar Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Optimizar Sistema
                  </Button>
                  <Button className="w-full justify-start" variant="destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Reiniciar Sistema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
