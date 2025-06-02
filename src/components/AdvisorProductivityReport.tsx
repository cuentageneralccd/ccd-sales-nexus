
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  Phone,
  Target,
  Clock,
  Award
} from "lucide-react";
import { useAdvisorPerformance } from "@/hooks/useAdvisorPerformance";

export const AdvisorProductivityReport = () => {
  const { advisors, getTeamStats } = useAdvisorPerformance();
  const [timeRange, setTimeRange] = useState('today');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [sortBy, setSortBy] = useState('qualityScore');

  const teamStats = getTeamStats();
  const campaigns = [...new Set(advisors.map(a => a.campaign))];

  const getFilteredAdvisors = () => {
    let filtered = [...advisors];
    
    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(advisor => advisor.campaign === selectedCampaign);
    }

    // Ordenar por el criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'qualityScore':
          return b.qualityScore - a.qualityScore;
        case 'callsToday':
          return b.callsToday - a.callsToday;
        case 'salesToday':
          return b.salesToday - a.salesToday;
        case 'conversionRate':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAdvisors = getFilteredAdvisors();

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { level: 'Bueno', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { level: 'Promedio', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Necesita Mejora', color: 'bg-red-100 text-red-800' };
  };

  const getProductivityMetrics = () => {
    const totalCalls = filteredAdvisors.reduce((sum, a) => sum + a.callsToday, 0);
    const totalSales = filteredAdvisors.reduce((sum, a) => sum + a.salesToday, 0);
    const avgQuality = filteredAdvisors.reduce((sum, a) => sum + a.qualityScore, 0) / filteredAdvisors.length;
    const totalProductiveTime = filteredAdvisors.reduce((sum, a) => sum + a.productiveTime, 0);

    return {
      totalCalls,
      totalSales,
      avgQuality: Math.round(avgQuality * 10) / 10,
      avgConversion: totalCalls > 0 ? Math.round((totalSales / totalCalls) * 100 * 10) / 10 : 0,
      totalProductiveHours: Math.round(totalProductiveTime / 3600)
    };
  };

  const metrics = getProductivityMetrics();

  const exportReport = () => {
    const csvData = [
      ['Asesor', 'Campaña', 'Llamadas', 'Ventas', 'Conversión %', 'Calidad %', 'Tiempo Productivo'],
      ...filteredAdvisors.map(advisor => [
        advisor.name,
        advisor.campaign,
        advisor.callsToday,
        advisor.salesToday,
        advisor.conversionRate,
        advisor.qualityScore,
        Math.round(advisor.productiveTime / 3600)
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `reporte_productividad_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Controles y Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Reporte de Productividad
            </div>
            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Campaña" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Campañas</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign} value={campaign}>
                    {campaign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualityScore">Calidad</SelectItem>
                <SelectItem value="callsToday">Llamadas</SelectItem>
                <SelectItem value="salesToday">Ventas</SelectItem>
                <SelectItem value="conversionRate">Conversión</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Asesores Activos</p>
                <p className="text-2xl font-bold">{filteredAdvisors.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Llamadas</p>
                <p className="text-2xl font-bold">{metrics.totalCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-green-600">{metrics.totalSales}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversión Promedio</p>
                <p className="text-2xl font-bold">{metrics.avgConversion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calidad Promedio</p>
                <p className="text-2xl font-bold">{metrics.avgQuality}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Productividad Detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Productividad por Asesor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Ranking</th>
                  <th className="text-left p-3">Asesor</th>
                  <th className="text-left p-3">Campaña</th>
                  <th className="text-right p-3">Llamadas</th>
                  <th className="text-right p-3">Contactos</th>
                  <th className="text-right p-3">Citas</th>
                  <th className="text-right p-3">Ventas</th>
                  <th className="text-right p-3">Conversión</th>
                  <th className="text-right p-3">Calidad</th>
                  <th className="text-right p-3">Tiempo Productivo</th>
                  <th className="text-center p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvisors.map((advisor, index) => (
                  <tr key={advisor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-sm text-gray-600">{advisor.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{advisor.campaign}</td>
                    <td className="p-3 text-right font-medium">{advisor.callsToday}</td>
                    <td className="p-3 text-right">{advisor.contactsToday}</td>
                    <td className="p-3 text-right">{advisor.appointmentsToday}</td>
                    <td className="p-3 text-right font-medium text-green-600">{advisor.salesToday}</td>
                    <td className="p-3 text-right">{advisor.conversionRate}%</td>
                    <td className="p-3 text-right">
                      <Badge className={getPerformanceLevel(advisor.qualityScore).color}>
                        {advisor.qualityScore}%
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm">{Math.round(advisor.productiveTime / 3600)}h</span>
                        <Progress 
                          value={(advisor.productiveTime / 28800) * 100} 
                          className="w-16 h-1 mt-1"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        className={advisor.status === 'ACTIVE' ? 'bg-green-500 text-white' : 
                                  advisor.status === 'BREAK' ? 'bg-yellow-500 text-white' : 
                                  'bg-gray-500 text-white'}
                      >
                        {advisor.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Rendimiento por Niveles */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {['Excelente', 'Bueno', 'Promedio', 'Necesita Mejora'].map((level, index) => {
              const ranges = [
                { min: 90, max: 100 },
                { min: 80, max: 89 },
                { min: 70, max: 79 },
                { min: 0, max: 69 }
              ];
              
              const count = filteredAdvisors.filter(advisor => 
                advisor.qualityScore >= ranges[index].min && advisor.qualityScore <= ranges[index].max
              ).length;
              
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
              
              return (
                <div key={level} className="text-center p-4 border rounded-lg">
                  <div className={`w-12 h-12 ${colors[index]} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg`}>
                    {count}
                  </div>
                  <p className="font-medium">{level}</p>
                  <p className="text-sm text-gray-600">
                    {ranges[index].min}-{ranges[index].max}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
