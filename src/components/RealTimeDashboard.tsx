
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, TrendingUp, Clock, Target, Activity } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";

export const RealTimeDashboard = () => {
  const { realTimeStats } = useRealTimeData();

  const statCards = [
    {
      title: "Asesores Activos",
      value: realTimeStats.activeAgents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Llamadas en Curso",
      value: realTimeStats.callsInProgress,
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Llamadas Hoy",
      value: realTimeStats.totalCallsToday,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Tiempo Promedio",
      value: `${realTimeStats.avgWaitTime}s`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Campañas Activas",
      value: realTimeStats.campaignsActive,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Leads en Cola",
      value: realTimeStats.leadsInQueue,
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard en Tiempo Real</h2>
        <Badge variant="secondary" className="animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          En Vivo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Sistema Vicidial</span>
              <Badge className="bg-green-500 text-white">ONLINE</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Base de Datos</span>
              <Badge className="bg-blue-500 text-white">CONECTADO</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Servidor de Grabación</span>
              <Badge className="bg-yellow-500 text-white">FUNCIONANDO</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
