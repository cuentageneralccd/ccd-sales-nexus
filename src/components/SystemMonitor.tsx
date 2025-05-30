
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, Activity, Database, Server, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  description: string;
  lastCheck: string;
}

interface APIStatus {
  endpoint: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastCheck: string;
  uptime: number;
}

export const SystemMonitor = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simular datos de monitoreo del sistema
    const mockSystemHealth: SystemHealth[] = [
      {
        component: "CPU Usage",
        status: "healthy",
        value: 35,
        unit: "%",
        description: "Uso de CPU del servidor Vicidial",
        lastCheck: new Date().toLocaleTimeString()
      },
      {
        component: "Memory Usage",
        status: "warning",
        value: 78,
        unit: "%",
        description: "Uso de memoria RAM",
        lastCheck: new Date().toLocaleTimeString()
      },
      {
        component: "Disk Space",
        status: "healthy",
        value: 45,
        unit: "%",
        description: "Espacio en disco utilizado",
        lastCheck: new Date().toLocaleTimeString()
      },
      {
        component: "Database Connections",
        status: "healthy",
        value: 23,
        unit: "/100",
        description: "Conexiones activas a MySQL",
        lastCheck: new Date().toLocaleTimeString()
      },
      {
        component: "Active Calls",
        status: "healthy",
        value: 12,
        unit: "calls",
        description: "Llamadas simultáneas activas",
        lastCheck: new Date().toLocaleTimeString()
      }
    ];

    const mockApiStatus: APIStatus[] = [
      {
        endpoint: "Agent API",
        status: "online",
        responseTime: 145,
        lastCheck: new Date().toLocaleTimeString(),
        uptime: 99.8
      },
      {
        endpoint: "NON-Agent API",
        status: "online",
        responseTime: 98,
        lastCheck: new Date().toLocaleTimeString(),
        uptime: 99.9
      },
      {
        endpoint: "MySQL Database",
        status: "online",
        responseTime: 12,
        lastCheck: new Date().toLocaleTimeString(),
        uptime: 99.95
      },
      {
        endpoint: "Asterisk PBX",
        status: "degraded",
        responseTime: 234,
        lastCheck: new Date().toLocaleTimeString(),
        uptime: 98.5
      }
    ];

    setSystemHealth(mockSystemHealth);
    setApiStatus(mockApiStatus);

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      setSystemHealth(prev => prev.map(item => ({
        ...item,
        value: Math.max(0, Math.min(100, item.value + (Math.random() - 0.5) * 10)),
        lastCheck: new Date().toLocaleTimeString()
      })));

      setApiStatus(prev => prev.map(api => ({
        ...api,
        responseTime: Math.max(50, api.responseTime + (Math.random() - 0.5) * 50),
        lastCheck: new Date().toLocaleTimeString()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical' | 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'bg-green-500';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const runSystemCheck = () => {
    toast({
      title: "Verificación Iniciada",
      description: "Ejecutando verificación completa del sistema...",
    });

    // Simular verificación
    setTimeout(() => {
      toast({
        title: "Verificación Completada",
        description: "Sistema funcionando correctamente",
      });
    }, 2000);
  };

  const overallHealth = systemHealth.reduce((acc, item) => {
    if (item.status === 'critical') return 'critical';
    if (item.status === 'warning' && acc !== 'critical') return 'warning';
    return acc === 'critical' || acc === 'warning' ? acc : 'healthy';
  }, 'healthy' as 'healthy' | 'warning' | 'critical');

  return (
    <div className="space-y-6">
      {/* Header con estado general */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Monitor del Sistema</h2>
          <Badge className={`${getStatusColor(overallHealth)} text-white`}>
            {overallHealth === 'healthy' ? 'Saludable' : 
             overallHealth === 'warning' ? 'Advertencia' : 'Crítico'}
          </Badge>
        </div>
        <Button onClick={runSystemCheck}>
          <Activity className="h-4 w-4 mr-2" />
          Verificar Sistema
        </Button>
      </div>

      {/* Salud del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Salud del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemHealth.map((item) => (
              <div key={item.component} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <h3 className="font-medium">{item.component}</h3>
                  </div>
                  <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                    {item.value}{item.unit}
                  </Badge>
                </div>
                
                {item.unit === '%' && (
                  <Progress 
                    value={item.value} 
                    className={`h-2 mb-3 ${
                      item.status === 'critical' ? '[&>div]:bg-red-500' :
                      item.status === 'warning' ? '[&>div]:bg-yellow-500' :
                      '[&>div]:bg-green-500'
                    }`}
                  />
                )}
                
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">Última verificación: {item.lastCheck}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado de APIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Estado de APIs y Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiStatus.map((api) => (
              <div key={api.endpoint} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(api.status)}
                  <div>
                    <h3 className="font-medium">{api.endpoint}</h3>
                    <p className="text-sm text-gray-600">Uptime: {api.uptime}%</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">{api.responseTime}ms</p>
                  <p className="text-xs text-gray-500">{api.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Base de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Métricas de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-blue-700">2.4M</h3>
              <p className="text-sm text-blue-600">Total Leads</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-green-700">156K</h3>
              <p className="text-sm text-green-600">Llamadas Este Mes</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-bold text-purple-700">8.2GB</h3>
              <p className="text-sm text-purple-600">Tamaño BD</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Consultas Recientes</h4>
            <div className="text-sm space-y-1">
              <p><code className="bg-white px-2 py-1 rounded">SELECT * FROM vicidial_live_agents WHERE status='READY'</code> - 12ms</p>
              <p><code className="bg-white px-2 py-1 rounded">INSERT INTO vicidial_log VALUES (...)</code> - 8ms</p>
              <p><code className="bg-white px-2 py-1 rounded">UPDATE vicidial_list SET status='CALLBACK' WHERE lead_id=...</code> - 15ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
