
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, Webhook, Key, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VicidialConfig = () => {
  const [config, setConfig] = useState({
    // Configuración de API
    apiUrl: "http://192.168.1.100",
    apiUser: "api_user",
    apiPassword: "",
    
    // Configuración de Base de Datos
    dbHost: "localhost",
    dbUser: "vicidial_user",
    dbPassword: "",
    dbName: "asterisk",
    
    // Webhooks
    dispositionWebhook: "",
    popupWebhook: "",
    
    // Configuración de Seguridad
    sslEnabled: true,
    ipWhitelist: "192.168.1.0/24",
    
    // Configuración de Notificaciones
    emailAlerts: true,
    alertEmail: "admin@company.com",
    
    // Configuración de Performance
    rateLimitEnabled: true,
    maxRequestsPerMinute: 60,
    connectionPoolSize: 20
  });

  const { toast } = useToast();

  const handleSaveConfig = (section: string) => {
    console.log(`Guardando configuración de ${section}:`, config);
    
    toast({
      title: "Configuración Guardada",
      description: `Configuración de ${section} actualizada exitosamente`,
    });
  };

  const testConnection = async (type: 'api' | 'database') => {
    console.log(`Probando conexión ${type}...`);
    
    // Simular test de conexión
    setTimeout(() => {
      toast({
        title: "Conexión Exitosa",
        description: `Conexión ${type} establecida correctamente`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">Configuración de Vicidial</h2>
        <Settings className="h-6 w-6 text-gray-500" />
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Configuración de API Vicidial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="apiUrl">URL del Servidor Vicidial</Label>
                  <Input
                    id="apiUrl"
                    value={config.apiUrl}
                    onChange={(e) => setConfig({...config, apiUrl: e.target.value})}
                    placeholder="http://192.168.1.100"
                  />
                </div>
                <div>
                  <Label htmlFor="apiUser">Usuario API</Label>
                  <Input
                    id="apiUser"
                    value={config.apiUser}
                    onChange={(e) => setConfig({...config, apiUser: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="apiPassword">Contraseña API</Label>
                <Input
                  id="apiPassword"
                  type="password"
                  value={config.apiPassword}
                  onChange={(e) => setConfig({...config, apiPassword: e.target.value})}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Endpoints Configurados</h4>
                <div className="text-sm space-y-1">
                  <p>• Agent API: <code>{config.apiUrl}/agc/api.php</code></p>
                  <p>• NON-Agent API: <code>{config.apiUrl}/vicidial/non_agent_api.php</code></p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => testConnection('api')}>
                  Probar Conexión API
                </Button>
                <Button onClick={() => handleSaveConfig('API')} variant="outline">
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Configuración de Base de Datos MySQL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dbHost">Host de Base de Datos</Label>
                  <Input
                    id="dbHost"
                    value={config.dbHost}
                    onChange={(e) => setConfig({...config, dbHost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dbName">Nombre de Base de Datos</Label>
                  <Input
                    id="dbName"
                    value={config.dbName}
                    onChange={(e) => setConfig({...config, dbName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dbUser">Usuario de Base de Datos</Label>
                  <Input
                    id="dbUser"
                    value={config.dbUser}
                    onChange={(e) => setConfig({...config, dbUser: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dbPassword">Contraseña</Label>
                  <Input
                    id="dbPassword"
                    type="password"
                    value={config.dbPassword}
                    onChange={(e) => setConfig({...config, dbPassword: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="connectionPool">Tamaño del Pool de Conexiones</Label>
                <Input
                  id="connectionPool"
                  type="number"
                  value={config.connectionPoolSize}
                  onChange={(e) => setConfig({...config, connectionPoolSize: parseInt(e.target.value)})}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Tablas Principales</h4>
                <div className="text-sm space-y-1">
                  <p>• vicidial_list - Gestión de leads</p>
                  <p>• vicidial_log - Registro de llamadas</p>
                  <p>• vicidial_callbacks - Callbacks programados</p>
                  <p>• vicidial_live_agents - Agentes activos</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => testConnection('database')}>
                  Probar Conexión BD
                </Button>
                <Button onClick={() => handleSaveConfig('Base de Datos')} variant="outline">
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2" />
                Configuración de Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="dispositionWebhook">Webhook de Disposición</Label>
                <Input
                  id="dispositionWebhook"
                  value={config.dispositionWebhook}
                  onChange={(e) => setConfig({...config, dispositionWebhook: e.target.value})}
                  placeholder="https://crm.company.com/webhook/call_completed"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Se ejecuta cuando se completa una llamada
                </p>
              </div>

              <div>
                <Label htmlFor="popupWebhook">Webhook de Popup</Label>
                <Input
                  id="popupWebhook"
                  value={config.popupWebhook}
                  onChange={(e) => setConfig({...config, popupWebhook: e.target.value})}
                  placeholder="https://crm.company.com/popup/contact"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Se ejecuta cuando inicia una llamada para mostrar información del contacto
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-2">Variables Disponibles</h4>
                <div className="text-sm space-y-1">
                  <p>• <code>--A--vendor_lead_code--B--</code> - ID del CRM</p>
                  <p>• <code>--A--dispo--B--</code> - Disposición final</p>
                  <p>• <code>--A--comments--B--</code> - Comentarios del agente</p>
                  <p>• <code>--A--phone_number--B--</code> - Número llamado</p>
                  <p>• <code>--A--length_in_sec--B--</code> - Duración de la llamada</p>
                </div>
              </div>

              <Button onClick={() => handleSaveConfig('Webhooks')} variant="outline">
                Guardar Webhooks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>SSL/HTTPS Habilitado</Label>
                  <p className="text-sm text-gray-600">Usar conexiones seguras</p>
                </div>
                <Switch
                  checked={config.sslEnabled}
                  onCheckedChange={(checked) => setConfig({...config, sslEnabled: checked})}
                />
              </div>

              <div>
                <Label htmlFor="ipWhitelist">Lista Blanca de IPs</Label>
                <Textarea
                  id="ipWhitelist"
                  value={config.ipWhitelist}
                  onChange={(e) => setConfig({...config, ipWhitelist: e.target.value})}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  rows={3}
                />
                <p className="text-sm text-gray-600 mt-1">
                  IPs permitidas para acceder a las APIs (una por línea)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-gray-600">Limitar requests por minuto</p>
                </div>
                <Switch
                  checked={config.rateLimitEnabled}
                  onCheckedChange={(checked) => setConfig({...config, rateLimitEnabled: checked})}
                />
              </div>

              {config.rateLimitEnabled && (
                <div>
                  <Label htmlFor="maxRequests">Máximo Requests por Minuto</Label>
                  <Input
                    id="maxRequests"
                    type="number"
                    value={config.maxRequestsPerMinute}
                    onChange={(e) => setConfig({...config, maxRequestsPerMinute: parseInt(e.target.value)})}
                  />
                </div>
              )}

              <Button onClick={() => handleSaveConfig('Seguridad')} variant="outline">
                Guardar Configuración de Seguridad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configuración de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas por Email</Label>
                  <p className="text-sm text-gray-600">Recibir notificaciones de sistema</p>
                </div>
                <Switch
                  checked={config.emailAlerts}
                  onCheckedChange={(checked) => setConfig({...config, emailAlerts: checked})}
                />
              </div>

              {config.emailAlerts && (
                <div>
                  <Label htmlFor="alertEmail">Email para Alertas</Label>
                  <Input
                    id="alertEmail"
                    type="email"
                    value={config.alertEmail}
                    onChange={(e) => setConfig({...config, alertEmail: e.target.value})}
                  />
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Tipos de Alertas</h4>
                <div className="text-sm space-y-1">
                  <p>• Errores de API (rate limit, timeouts)</p>
                  <p>• Problemas de base de datos</p>
                  <p>• Alto uso de recursos del sistema</p>
                  <p>• Caídas de servicios críticos</p>
                </div>
              </div>

              <Button onClick={() => handleSaveConfig('Alertas')} variant="outline">
                Guardar Configuración de Alertas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
