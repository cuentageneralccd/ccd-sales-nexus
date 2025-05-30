
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Play, Pause, BarChart3, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';
  listId: string;
  dialMethod: 'MANUAL' | 'RATIO' | 'ADAPT_HARD_LIMIT';
  maxRatio: number;
  totalLeads: number;
  contactedLeads: number;
  successfulCalls: number;
  startDate: string;
  endDate?: string;
  agentsAssigned: number;
  priority: number;
  conversionRate: number;
}

export const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Simular carga de campañas
    const mockCampaigns: Campaign[] = [
      {
        id: "camp_001",
        name: "Prospección Q2 2025",
        description: "Campaña de prospección para clientes potenciales alto valor",
        status: "ACTIVE",
        listId: "1001",
        dialMethod: "RATIO",
        maxRatio: 2.5,
        totalLeads: 2500,
        contactedLeads: 1250,
        successfulCalls: 375,
        startDate: "2025-05-01",
        agentsAssigned: 8,
        priority: 8,
        conversionRate: 15.2
      },
      {
        id: "camp_002",
        name: "Seguimiento Clientes",
        description: "Campaña de seguimiento para clientes existentes",
        status: "ACTIVE",
        listId: "1002",
        dialMethod: "MANUAL",
        maxRatio: 1.0,
        totalLeads: 800,
        contactedLeads: 600,
        successfulCalls: 180,
        startDate: "2025-05-15",
        agentsAssigned: 5,
        priority: 6,
        conversionRate: 22.5
      }
    ];
    setCampaigns(mockCampaigns);
  }, []);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.dialMethod) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const campaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: newCampaign.name || "",
      description: newCampaign.description || "",
      status: "DRAFT",
      listId: `list_${Date.now()}`,
      dialMethod: newCampaign.dialMethod as Campaign['dialMethod'] || 'MANUAL',
      maxRatio: newCampaign.maxRatio || 1.0,
      totalLeads: 0,
      contactedLeads: 0,
      successfulCalls: 0,
      startDate: new Date().toISOString().split('T')[0],
      agentsAssigned: newCampaign.agentsAssigned || 1,
      priority: newCampaign.priority || 5,
      conversionRate: 0
    };

    console.log("Creando campaña en Vicidial:", campaign);
    
    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({});
    setIsCreateOpen(false);
    
    toast({
      title: "Campaña Creada",
      description: "Campaña configurada exitosamente en Vicidial",
    });
  };

  const handleCampaignAction = (campaignId: string, action: 'start' | 'pause' | 'stop') => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        let newStatus: Campaign['status'] = campaign.status;
        
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
        
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));

    toast({
      title: "Campaña Actualizada",
      description: `Acción ${action} ejecutada exitosamente`,
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'PAUSED':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      case 'DRAFT':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Gestión de Campañas ({campaigns.length})
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
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newCampaign.description || ""}
                      onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dialMethod">Método de Marcación *</Label>
                    <Select onValueChange={(value) => setNewCampaign({...newCampaign, dialMethod: value as Campaign['dialMethod']})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                        <SelectItem value="RATIO">Ratio</SelectItem>
                        <SelectItem value="ADAPT_HARD_LIMIT">Adaptativo</SelectItem>
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
                        value={newCampaign.maxRatio || 1.0}
                        onChange={(e) => setNewCampaign({...newCampaign, maxRatio: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="agentsAssigned">Agentes Asignados</Label>
                      <Input
                        id="agentsAssigned"
                        type="number"
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
                  </div>
                  
                  <Button onClick={handleCreateCampaign} className="w-full">
                    Crear Campaña
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
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
                      className="h-2"
                    />
                  </div>

                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Leads</p>
                      <p className="font-medium">{campaign.totalLeads.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contactados</p>
                      <p className="font-medium">{campaign.contactedLeads.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conversión</p>
                      <p className="font-medium">{campaign.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agentes</p>
                      <p className="font-medium">{campaign.agentsAssigned}</p>
                    </div>
                  </div>

                  {/* Configuración */}
                  <div className="text-xs text-gray-600 border-t pt-3">
                    <div className="flex justify-between">
                      <span>Método: {campaign.dialMethod}</span>
                      <span>Ratio: {campaign.maxRatio}</span>
                      <span>Prioridad: {campaign.priority}/10</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2 pt-2">
                    {campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleCampaignAction(campaign.id, 'start')}
                        className="flex-1"
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
        </CardContent>
      </Card>
    </div>
  );
};
