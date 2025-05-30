
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, Phone, Send, Clock, CheckCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  channel: 'whatsapp' | 'email' | 'sms';
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  scheduledDate?: string;
}

interface Template {
  id: string;
  name: string;
  channel: 'whatsapp' | 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

export const CommunicationCenter = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp_001",
      name: "Bienvenida Nuevos Leads",
      channel: "whatsapp",
      status: "completed",
      recipients: 245,
      sent: 245,
      delivered: 240,
      opened: 180,
      clicked: 45
    },
    {
      id: "camp_002",
      name: "Promoción Cursos Mayo",
      channel: "email",
      status: "sending",
      recipients: 1200,
      sent: 800,
      delivered: 785,
      opened: 245,
      clicked: 67
    }
  ]);

  const [templates] = useState<Template[]>([
    {
      id: "tpl_001",
      name: "Bienvenida WhatsApp",
      channel: "whatsapp",
      content: "¡Hola {{nombre}}! Gracias por tu interés en {{curso}}. Un asesor te contactará pronto.",
      variables: ["nombre", "curso"]
    },
    {
      id: "tpl_002",
      name: "Seguimiento Email",
      channel: "email",
      subject: "{{nombre}}, no pierdas esta oportunidad",
      content: "Hola {{nombre}}, vimos tu interés en {{curso}}. Te ofrecemos 20% de descuento...",
      variables: ["nombre", "curso"]
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "whatsapp" as const,
    template: "",
    segment: "",
    scheduledDate: ""
  });

  const { toast } = useToast();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'sending': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.template) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const campaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: newCampaign.name,
      channel: newCampaign.channel,
      status: newCampaign.scheduledDate ? 'scheduled' : 'draft',
      recipients: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      scheduledDate: newCampaign.scheduledDate
    };

    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({
      name: "",
      channel: "whatsapp",
      template: "",
      segment: "",
      scheduledDate: ""
    });

    toast({
      title: "Campaña Creada",
      description: "La campaña ha sido configurada exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Centro de Comunicación Multicanal</h2>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      {/* Métricas de Comunicación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes Enviados Hoy</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <p className="text-xs text-muted-foreground">
              +15% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Entrega</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <p className="text-xs text-muted-foreground">
              Promedio todos los canales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respuestas Recibidas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              Requieren seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              2.7% tasa de conversión
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Crear Campaña</TabsTrigger>
          <TabsTrigger value="responses">Respuestas</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campañas Activas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(campaign.channel)}
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">Canal: {campaign.channel}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Destinatarios</p>
                      <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Enviados</p>
                      <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Entregados</p>
                      <p className="font-medium">{campaign.delivered.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Abiertos</p>
                      <p className="font-medium">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Clicks</p>
                      <p className="font-medium">{campaign.clicked.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">Ver Detalles</Button>
                    <Button size="sm" variant="outline">Duplicar</Button>
                    {campaign.status === 'draft' && (
                      <Button size="sm">Enviar Ahora</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nueva Campaña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de la Campaña</label>
                <Input
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="Ej: Promoción Black Friday"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Canal</label>
                  <Select
                    value={newCampaign.channel}
                    onValueChange={(value: any) => setNewCampaign({...newCampaign, channel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Template</label>
                  <Select
                    value={newCampaign.template}
                    onValueChange={(value) => setNewCampaign({...newCampaign, template: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(t => t.channel === newCampaign.channel)
                        .map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Segmento de Audiencia</label>
                  <Select
                    value={newCampaign.segment}
                    onValueChange={(value) => setNewCampaign({...newCampaign, segment: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_leads">Leads Nuevos</SelectItem>
                      <SelectItem value="not_contacted">Sin Contactar</SelectItem>
                      <SelectItem value="interested">Interesados</SelectItem>
                      <SelectItem value="callback">Callbacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Programar Envío</label>
                  <Input
                    type="datetime-local"
                    value={newCampaign.scheduledDate}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleCreateCampaign} className="w-full">
                Crear Campaña
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensajes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(template.channel)}
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <Badge variant="outline">{template.channel}</Badge>
                  </div>
                  
                  {template.subject && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Asunto:</strong> {template.subject}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-700 mb-2">{template.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {template.variables.map(variable => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="outline">Usar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Respuestas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay respuestas pendientes en este momento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
