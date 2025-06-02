
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Users, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  FileText,
  Monitor,
  Cog
} from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useKPITracking } from '@/hooks/useKPITracking';
import { useAdvancedLeadTracking } from '@/hooks/useAdvancedLeadTracking';
import { RealTimeAdvisorMonitor } from './RealTimeAdvisorMonitor';

export const AdministratorDashboard = () => {
  const { user } = useAuthContext();
  const { getTeamPerformanceOverview, getCriticalAlerts } = useKPITracking();
  const { getCampaignPerformance, getPromotionPerformance } = useAdvancedLeadTracking();
  
  const teamOverview = getTeamPerformanceOverview();
  const criticalAlerts = getCriticalAlerts();
  const campaignPerformance = getCampaignPerformance();
  const promotionPerformance = getPromotionPerformance();

  // Métricas financieras simuladas
  const financialMetrics = {
    monthlyRevenue: 125000000,
    monthlyTarget: 150000000,
    costPerLead: 12500,
    customerAcquisitionCost: 85000,
    lifeTimeValue: 2400000,
    churnRate: 3.2,
    profitMargin: 28.5,
    operationalCosts: 45000000
  };

  // Métricas del sistema
  const systemMetrics = {
    uptime: 99.7,
    averageResponseTime: 235,
    callsPerSecond: 15.3,
    databaseSize: 2.1,
    storageUsed: 67,
    apiCalls: 145000,
    errors: 23,
    activeConnections: 342
  };

  return (
    <div className="space-y-6">
      {/* Header del administrador */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-purple-100">
              {user?.name} - Control Total del Sistema
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-white text-purple-800 mb-2">
              ADMINISTRADOR
            </Badge>
            <p className="text-sm">
              Sistema: {systemMetrics.uptime}% Uptime
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(financialMetrics.monthlyRevenue / 1000000).toFixed(1)}M
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Progress 
                    value={(financialMetrics.monthlyRevenue / financialMetrics.monthlyTarget) * 100} 
                    className="w-full h-1 mr-2"
                  />
                  <span>{Math.round((financialMetrics.monthlyRevenue / financialMetrics.monthlyTarget) * 100)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asesores Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamOverview?.totalAdvisors || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {teamOverview?.criticalAdvisors || 0} en riesgo crítico
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score Promedio</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamOverview?.avgTotalScore || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Objetivo: 85%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {criticalAlerts.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención inmediata
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rendimiento de Campañas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Campañas por ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignPerformance.slice(0, 5).map((campaign, index) => (
                    <div key={campaign.campaignCode} className="flex items-center justify-between">
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
                          <p className="font-medium text-sm">{campaign.campaignName}</p>
                          <p className="text-xs text-gray-500">
                            {campaign.actualLeads || campaign.leadsGenerated} leads
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {(campaign.actualROI || campaign.roi).toFixed(1)}x ROI
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promociones Más Efectivas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotionPerformance.slice(0, 5).map((promotion, index) => (
                    <div key={promotion.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{promotion.promotionName}</p>
                        <p className="text-xs text-gray-500">
                          {promotion.interestedLeads} interesados - {promotion.conversions} conversiones
                        </p>
                      </div>
                      <Badge variant="outline">
                        {promotion.conversionRate.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estado del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{systemMetrics.uptime}%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{systemMetrics.averageResponseTime}ms</div>
                  <div className="text-sm text-gray-600">Respuesta</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{systemMetrics.callsPerSecond}</div>
                  <div className="text-sm text-gray-600">Llamadas/s</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{systemMetrics.activeConnections}</div>
                  <div className="text-sm text-gray-600">Conexiones</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <RealTimeAdvisorMonitor />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ingresos del Mes</span>
                      <span className="font-medium">
                        ${(financialMetrics.monthlyRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress 
                      value={(financialMetrics.monthlyRevenue / financialMetrics.monthlyTarget) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Costo por Lead</span>
                      <p className="font-medium">${financialMetrics.costPerLead.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">CAC</span>
                      <p className="font-medium">${financialMetrics.customerAcquisitionCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">LTV</span>
                      <p className="font-medium">${financialMetrics.lifeTimeValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Margen</span>
                      <p className="font-medium">{financialMetrics.profitMargin}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rentabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Ratio LTV/CAC</span>
                    <p className="text-2xl font-bold text-green-600">
                      {(financialMetrics.lifeTimeValue / financialMetrics.customerAcquisitionCost).toFixed(1)}x
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tasa de Abandono</span>
                    <p className="text-xl font-medium text-orange-600">{financialMetrics.churnRate}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Costos Operacionales</span>
                    <p className="text-xl font-medium">
                      ${(financialMetrics.operationalCosts / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proyecciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Ingresos Proyectados (Anual)</span>
                    <p className="text-xl font-bold text-blue-600">
                      ${(financialMetrics.monthlyRevenue * 12 / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Crecimiento Estimado</span>
                    <p className="text-xl font-medium text-green-600">+15.3%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Break-even Point</span>
                    <p className="text-xl font-medium">Q3 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Gestión de Usuarios
                </div>
                <Button>
                  Agregar Usuario
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <div className="text-sm text-gray-600">Total Usuarios</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">38</div>
                    <div className="text-sm text-gray-600">Usuarios Activos</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Administradores</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Usuarios por Rol</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Asesores</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-24 h-2" />
                        <span className="text-sm">32</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Supervisores</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={25} className="w-24 h-2" />
                        <span className="text-sm">10</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Administradores</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={10} className="w-24 h-2" />
                        <span className="text-sm">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Estado de la Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uso de Almacenamiento</span>
                      <span className="font-medium">{systemMetrics.storageUsed}%</span>
                    </div>
                    <Progress value={systemMetrics.storageUsed} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tamaño DB</span>
                      <p className="font-medium">{systemMetrics.databaseSize} TB</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Llamadas API</span>
                      <p className="font-medium">{systemMetrics.apiCalls.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Errores (24h)</span>
                      <p className="font-medium text-red-600">{systemMetrics.errors}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Conexiones</span>
                      <p className="font-medium">{systemMetrics.activeConnections}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Seguridad y Cumplimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Certificación ISO 27001</span>
                    <Badge className="bg-green-500 text-white">Activa</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Diario</span>
                    <Badge className="bg-green-500 text-white">Completado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auditoría de Seguridad</span>
                    <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cumplimiento GDPR</span>
                    <Badge className="bg-green-500 text-white">Certificado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cog className="h-5 w-5 mr-2" />
                  Configuración del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración de Vicidial
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Gestión de Base de Datos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Políticas de Seguridad
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Logs del Sistema
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones de Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    Optimizar Base de Datos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Limpiar Logs Antiguos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Actualizar Sistema
                  </Button>
                  <Button className="w-full justify-start" variant="destructive">
                    Reiniciar Servicios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Generación de Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Reporte Ejecutivo
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Reporte Financiero
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <Users className="h-6 w-6 mb-2" />
                  Reporte de Personal
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Análisis de Tendencias
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <Shield className="h-6 w-6 mb-2" />
                  Auditoría de Seguridad
                </Button>
                <Button className="h-20 justify-start flex-col" variant="outline">
                  <Activity className="h-6 w-6 mb-2" />
                  Reporte de Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
