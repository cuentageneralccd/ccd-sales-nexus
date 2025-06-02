
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Clock, TrendingDown, UserX, Target } from "lucide-react";
import { useAdvisorPerformance } from "@/hooks/useAdvisorPerformance";

interface Alert {
  id: string;
  type: 'PERFORMANCE' | 'ATTENDANCE' | 'QUALITY' | 'PRODUCTIVITY' | 'GOAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  advisorId: string;
  advisorName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const AdvisorAlerts = () => {
  const { advisors } = useAdvisorPerformance();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');

  useEffect(() => {
    generateAlerts();
  }, [advisors]);

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];

    advisors.forEach(advisor => {
      // Alertas de rendimiento bajo
      if (advisor.qualityScore < 70) {
        newAlerts.push({
          id: `perf_${advisor.id}`,
          type: 'PERFORMANCE',
          severity: advisor.qualityScore < 60 ? 'CRITICAL' : 'HIGH',
          advisorId: advisor.id,
          advisorName: advisor.name,
          message: `Calidad por debajo del estándar: ${advisor.qualityScore}%`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      // Alertas de baja productividad
      if (advisor.callsToday < 20) {
        newAlerts.push({
          id: `prod_${advisor.id}`,
          type: 'PRODUCTIVITY',
          severity: advisor.callsToday < 10 ? 'HIGH' : 'MEDIUM',
          advisorId: advisor.id,
          advisorName: advisor.name,
          message: `Pocas llamadas realizadas hoy: ${advisor.callsToday}`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      // Alertas de tiempo inactivo alto
      if (advisor.idleTime > 3600) { // Más de 1 hora inactivo
        newAlerts.push({
          id: `idle_${advisor.id}`,
          type: 'PRODUCTIVITY',
          severity: advisor.idleTime > 7200 ? 'HIGH' : 'MEDIUM',
          advisorId: advisor.id,
          advisorName: advisor.name,
          message: `Tiempo inactivo elevado: ${Math.round(advisor.idleTime / 60)} minutos`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      // Alertas de conversión baja
      if (advisor.conversionRate < 5) {
        newAlerts.push({
          id: `conv_${advisor.id}`,
          type: 'PERFORMANCE',
          severity: advisor.conversionRate < 2 ? 'HIGH' : 'MEDIUM',
          advisorId: advisor.id,
          advisorName: advisor.name,
          message: `Tasa de conversión baja: ${advisor.conversionRate}%`,
          timestamp: new Date().toISOString(),
          resolved: false
        });
      }

      // Alertas de estado offline prolongado
      if (advisor.status === 'OFFLINE') {
        const lastActivity = new Date(advisor.lastActivity);
        const now = new Date();
        const hoursOffline = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        
        if (hoursOffline > 2) {
          newAlerts.push({
            id: `offline_${advisor.id}`,
            type: 'ATTENDANCE',
            severity: hoursOffline > 4 ? 'CRITICAL' : 'HIGH',
            advisorId: advisor.id,
            advisorName: advisor.name,
            message: `Offline por ${Math.round(hoursOffline)} horas`,
            timestamp: new Date().toISOString(),
            resolved: false
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERFORMANCE': return <TrendingDown className="h-4 w-4" />;
      case 'ATTENDANCE': return <UserX className="h-4 w-4" />;
      case 'QUALITY': return <AlertTriangle className="h-4 w-4" />;
      case 'PRODUCTIVITY': return <Clock className="h-4 w-4" />;
      case 'GOAL': return <Target className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const filteredAlerts = filter === 'unresolved' 
    ? alerts.filter(alert => !alert.resolved)
    : alerts;

  const criticalAlerts = filteredAlerts.filter(alert => alert.severity === 'CRITICAL').length;
  const highAlerts = filteredAlerts.filter(alert => alert.severity === 'HIGH').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Alertas del Sistema ({filteredAlerts.length})
          </div>
          <div className="flex items-center space-x-2">
            {criticalAlerts > 0 && (
              <Badge className="bg-red-500 text-white">
                {criticalAlerts} Críticas
              </Badge>
            )}
            {highAlerts > 0 && (
              <Badge className="bg-orange-500 text-white">
                {highAlerts} Altas
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={filter === 'unresolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unresolved')}
          >
            Sin Resolver
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay alertas {filter === 'unresolved' ? 'sin resolver' : ''}</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alert.advisorName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolver
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
