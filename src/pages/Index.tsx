
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, TrendingUp, Clock, AlertCircle, Activity, Wifi, WifiOff } from "lucide-react";
import { LeadsManager } from "@/components/LeadsManager";
import { CampaignManager } from "@/components/CampaignManager";
import { CallCenter } from "@/components/CallCenter";
import { Analytics } from "@/components/Analytics";
import { SystemMonitor } from "@/components/SystemMonitor";
import { VicidialConfig } from "@/components/VicidialConfig";
import { FinancialDashboard } from "@/components/FinancialDashboard";
import { AutomationCenter } from "@/components/AutomationCenter";
import { CommunicationCenter } from "@/components/CommunicationCenter";
import { useRealTimeData } from "@/hooks/useRealTimeData";

const Index = () => {
  const { stats, isConnected } = useRealTimeData();
  const [activeTab, setActiveTab] = useState("callcenter");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mejorado */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">CCD Sales Nexus</h1>
              <Badge variant="outline" className="ml-3">Vicidial Optimized</Badge>
              <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center">
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 mr-1 text-green-500" />
                Sistema Activo
              </div>
              <div className="text-sm text-gray-600">
                Última actualización: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats en Tiempo Real */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAgents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.callsInProgress} en llamada
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Llamadas Hoy</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayCalls}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.callsInProgress} en progreso
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversión</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.salesToday} ventas hoy
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCallTime}s</div>
              <p className="text-xs text-muted-foreground">
                Cola: {stats.queueSize} esperando
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas en Tiempo Real */}
        {stats.queueSize > 10 && (
          <div className="mb-6">
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="font-medium text-red-800">Cola de Llamadas Alta</p>
                    <p className="text-sm text-red-600">
                      {stats.queueSize} leads esperando llamada. Considera asignar más agentes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="callcenter">Call Center</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="campaigns">Campañas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automatización</TabsTrigger>
            <TabsTrigger value="communication">Comunicación</TabsTrigger>
            <TabsTrigger value="financial">Financiero</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="callcenter">
            <CallCenter />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationCenter />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDashboard />
          </TabsContent>

          <TabsContent value="monitor">
            <SystemMonitor />
          </TabsContent>

          <TabsContent value="config">
            <VicidialConfig />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
