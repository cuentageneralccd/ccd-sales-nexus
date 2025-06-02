
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  Phone, 
  Pause, 
  Play, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  User,
  Clock,
  Target,
  Activity,
  BarChart3,
  Bell,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";
import { useKPITracking } from "@/hooks/useKPITracking";
import { useAdvancedLeadTracking } from "@/hooks/useAdvancedLeadTracking";
import { vicidialService } from "@/services/vicidialService";

export const RealTimeAdvisorMonitor = () => {
  const { 
    advisorProfiles, 
    allAlerts, 
    isCalculating, 
    updateAdvisorProfiles,
    acknowledgeAlert,
    resolveAlert,
    getCriticalAlerts,
    getTeamPerformanceOverview 
  } = useKPITracking();
  
  const { leads, getCampaignPerformance } = useAdvancedLeadTracking();
  
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // segundos

  const teamOverview = getTeamPerformanceOverview();
  const criticalAlerts = getCriticalAlerts();
  const campaignPerformance = getCampaignPerformance();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      updateAdvisorProfiles();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, updateAdvisorProfiles]);

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DECLINING': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredProfiles = advisorProfiles.filter(profile => {
    if (selectedAdvisor !== 'all' && profile.advisorId !== selectedAdvisor) return false;
    if (filterStatus === 'critical' && profile.riskLevel !== 'CRITICAL') return false;
    if (filterStatus === 'warning' && !['HIGH', 'MEDIUM'].includes(profile.riskLevel)) return false;
    return true;
  });

  const exportData = () => {
    const csvData = [
      ['Asesor', 'Score Total', 'Riesgo', 'Tendencia', 'Alertas Activas', 'KPIs Críticos'],
      ...filteredProfiles.map(profile => [
        profile.advisorName,
        profile.totalScore,
        profile.riskLevel,
        profile.performanceTrend,
        profile.activeAlerts.length,
        profile.kpiResults.filter(k => k.status === 'CRITICAL').length
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `monitoreo_asesores_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Panel de Control Superior */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Monitoreo en Tiempo Real - Asesores
              {isCalculating && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={autoRefresh ? "default" : "secondary"}>
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={updateAdvisorProfiles}
                disabled={isCalculating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar Asesor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Asesores</SelectItem>
                {advisorProfiles.map((profile) => (
                  <SelectItem key={profile.advisorId} value={profile.advisorId}>
                    {profile.advisorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="critical">Críticos</SelectItem>
                <SelectItem value="warning">Con Alertas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Tarjetas</SelectItem>
                <SelectItem value="list">Lista</SelectItem>
              </SelectContent>
            </Select>

            <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 segundos</SelectItem>
                <SelectItem value="30">30 segundos</SelectItem>
                <SelectItem value="60">1 minuto</SelectItem>
                <SelectItem value="300">5 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resumen General del Equipo */}
          {teamOverview && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{teamOverview.totalAdvisors}</div>
                <div className="text-sm text-gray-600">Total Asesores</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{teamOverview.avgTotalScore}</div>
                <div className="text-sm text-gray-600">Score Promedio</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{teamOverview.criticalAdvisors}</div>
                <div className="text-sm text-gray-600">En Riesgo</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{teamOverview.criticalAlerts}</div>
                <div className="text-sm text-gray-600">Alertas Críticas</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{teamOverview.improvingAdvisors}</div>
                <div className="text-sm text-gray-600">Mejorando</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{teamOverview.decliningAdvisors}</div>
                <div className="text-sm text-gray-600">En Declive</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="advisors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="advisors">Asesores</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertas {criticalAlerts.length > 0 && <Badge className="ml-1">{criticalAlerts.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="advisors">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.advisorId} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <h4 className="font-medium">{profile.advisorName}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(profile.performanceTrend)}
                        <Badge className={getStatusColor(profile.riskLevel)}>
                          {profile.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Score General */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score Total</span>
                          <span className="font-medium">{profile.totalScore}%</span>
                        </div>
                        <Progress value={profile.totalScore} className="h-2" />
                      </div>

                      {/* KPIs Críticos */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium text-green-600">
                            {profile.kpiResults.filter(k => k.status === 'EXCELLENT').length}
                          </div>
                          <div className="text-xs text-gray-600">Excelentes</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium text-red-600">
                            {profile.kpiResults.filter(k => k.status === 'CRITICAL').length}
                          </div>
                          <div className="text-xs text-gray-600">Críticos</div>
                        </div>
                      </div>

                      {/* Alertas Activas */}
                      {profile.activeAlerts.length > 0 && (
                        <div className="flex items-center p-2 bg-orange-50 rounded">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">{profile.activeAlerts.length} alertas activas</span>
                        </div>
                      )}

                      {/* Acciones Rápidas */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalle
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Asesor</th>
                        <th className="text-center p-3">Score</th>
                        <th className="text-center p-3">Riesgo</th>
                        <th className="text-center p-3">Tendencia</th>
                        <th className="text-center p-3">KPIs Críticos</th>
                        <th className="text-center p-3">Alertas</th>
                        <th className="text-center p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => (
                        <tr key={profile.advisorId} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{profile.advisorName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{profile.totalScore}%</span>
                              <Progress value={profile.totalScore} className="w-16 h-1 mt-1" />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className={getStatusColor(profile.riskLevel)}>
                              {profile.riskLevel}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            {getTrendIcon(profile.performanceTrend)}
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-medium text-red-600">
                              {profile.kpiResults.filter(k => k.status === 'CRITICAL').length}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {profile.activeAlerts.length > 0 && (
                              <Badge variant="destructive">
                                {profile.activeAlerts.length}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Alertas Activas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay alertas críticas activas</p>
                  </div>
                ) : (
                  criticalAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{alert.advisorName}</h4>
                            <Badge className="bg-red-500 text-white">
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">
                              {alert.kpiName}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Acciones Sugeridas:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside">
                              {alert.suggestedActions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id, 'current_user')}
                          >
                            Reconocer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => resolveAlert(alert.id, 'current_user')}
                          >
                            Resolver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamOverview && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento por Categoría</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(teamOverview.avgCategoryScores).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-medium">{Math.round(score)}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Riesgo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => {
                        const count = advisorProfiles.filter(p => p.riskLevel === level).length;
                        const percentage = advisorProfiles.length > 0 ? (count / advisorProfiles.length) * 100 : 0;
                        
                        return (
                          <div key={level} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(level)}>
                                {level}
                              </Badge>
                              <span className="text-sm">{count} asesores</span>
                            </div>
                            <div className="w-24">
                              <Progress value={percentage} className="h-2" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Rendimiento por Campaña
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Campaña</th>
                      <th className="text-center p-3">Leads</th>
                      <th className="text-center p-3">Conversiones</th>
                      <th className="text-center p-3">Tasa Conv.</th>
                      <th className="text-center p-3">ROI</th>
                      <th className="text-center p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformance.map((campaign) => (
                      <tr key={campaign.campaignCode} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{campaign.campaignName}</div>
                            <div className="text-sm text-gray-600">{campaign.campaignCode}</div>
                          </div>
                        </td>
                        <td className="p-3 text-center">{campaign.actualLeads || campaign.leadsGenerated}</td>
                        <td className="p-3 text-center">{campaign.actualConversions || campaign.conversions}</td>
                        <td className="p-3 text-center">
                          {Math.round((campaign.actualConversionRate || 0) * 100) / 100}%
                        </td>
                        <td className="p-3 text-center">
                          <span className={campaign.actualROI >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {Math.round((campaign.actualROI || campaign.roi) * 100) / 100}x
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={campaign.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                            {campaign.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
