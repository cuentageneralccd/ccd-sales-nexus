
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Play, Pause, BarChart3, Settings, TrendingUp, Users, Phone } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";

export const CampaignManager = () => {
  const { 
    campaigns, 
    isLoading, 
    createCampaign, 
    updateCampaignStatus,
    getCampaignStats,
    getTopPerformingCampaigns
  } = useCampaigns();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<any>({});

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.dialMethod) {
      return;
    }

    await createCampaign(newCampaign);
    setNewCampaign({});
    setIsCreateOpen(false);
  };

  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'stop') => {
    let newStatus: any = 'DRAFT';
    
    switch (action) {
      case 'start':
        newStatus = 'ACTIVE';
        break;
      case 'pause':
        newStatus = 'PAUSED';
        break;
      case 'stop':
        newStatus = 'COMPLETED';
        break;
    }
    
    await updateCampaignStatus(campaignId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-blue-500';
      case 'DRAFT': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = getCampaignStats();
  const topCampaigns = getTopPerformingCampaigns();

  return (
    <div className="space-y-6">
      {/* KPIs de Campañas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campañas Activas</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contactados</p>
                <p className="text-2xl font-bold">{stats.totalContacted.toLocaleString()}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversión Promedio</p>
                <p className="text-2xl font-bold">{stats.avgConversion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      {topCampaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mejores Campañas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-gold text-white">#{index + 1}</Badge>
                    <Badge variant="outline">{campaign.conversionRate}%</Badge>
                  </div>
                  <h4 className="font-medium">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.successfulCalls} ventas de {campaign.contactedLeads} contactos</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Gestión de Campañas ({campaigns.length})
              {isLoading && <span className="ml-2 text-sm text-gray-500">Sincronizando...</span>}
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Campaña</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre de Campaña *</Label>
                    <Input
                      id="name"
                      value={newCampaign.name || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="Ej: Prospección Q3 2025"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newCampaign.description || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                      placeholder="Describe el objetivo de la campaña..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dialMethod">Método de Marcación *</Label>
                    <Select onValueChange={(value) => setNewCampaign({...newCampaign, dialMethod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANUAL">Manual - Control total del agente</SelectItem>
                        <SelectItem value="RATIO">Ratio - Marcación automática con ratio</SelectItem>
                        <SelectItem value="ADAPT_HARD_LIMIT">Adaptativo - IA optimizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxRatio">Ratio Máximo</Label>
                      <Input
                        id="maxRatio"
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={newCampaign.maxRatio || 2.0}
                        onChange={(e) => setNewCampaign({...newCampaign, maxRatio: parseFloat(e.target.value)})}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Llamadas por agente disponible
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="agentsAssigned">Agentes Asignados</Label>
                      <Input
                        id="agentsAssigned"
                        type="number"
                        min="1"
                        max="20"
                        value={newCampaign.agentsAssigned || 1}
                        onChange={(e) => setNewCampaign({...newCampaign, agentsAssigned: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridad (1-10)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={newCampaign.priority || 5}
                      onChange={(e) => setNewCampaign({...newCampaign, priority: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mayor prioridad = más recursos asignados
                    </p>
                  </div>
                  
                  <Button onClick={handleCreateCampaign} className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Campaña"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{campaign.name}</span>
                        {campaign.conversionRate > 20 && (
                          <Badge className="bg-green-500 text-white text-xs">TOP</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progreso de la campaña */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span>{campaign.totalLeads > 0 ? Math.round((campaign.contactedLeads / campaign.totalLeads) * 100) : 0}%</span>
                    </div>
                    <Progress 
                      value={campaign.totalLeads > 0 ? (campaign.contactedLeads / campaign.totalLeads) * 100 : 0} 
                      className="h-3"
                    />
                  </div>

                  {/* Métricas Detalladas */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-gray-600">Total Leads</p>
                      <p className="font-bold text-lg">{campaign.totalLeads.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-gray-600">Contactados</p>
                      <p className="font-bold text-lg">{campaign.contactedLeads.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-gray-600">Conversión</p>
                      <p className="font-bold text-lg text-purple-600">{campaign.conversionRate}%</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded">
                      <p className="text-gray-600">Agentes</p>
                      <p className="font-bold text-lg">{campaign.agentsAssigned}</p>
                    </div>
                  </div>

                  {/* Configuración Técnica */}
                  <div className="text-xs text-gray-600 border-t pt-3 bg-gray-50 p-2 rounded">
                    <div className="grid grid-cols-3 gap-2">
                      <span><strong>Método:</strong> {campaign.dialMethod}</span>
                      <span><strong>Ratio:</strong> {campaign.maxRatio}</span>
                      <span><strong>Prioridad:</strong> {campaign.priority}/10</span>
                    </div>
                    <div className="mt-1">
                      <span><strong>Inicio:</strong> {campaign.startDate}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2 pt-2">
                    {campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleCampaignAction(campaign.id, 'start')}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCampaignAction(campaign.id, 'pause')}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pausar
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Stats
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay campañas configuradas</p>
              <p className="text-sm">Crea tu primera campaña para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
