
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Search, Phone, Edit, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  vendorLeadCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  status: string;
  source: string;
  entryDate: string;
  lastCallDate?: string;
  callCount: number;
  comments: string;
  priority: number;
}

export const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Simular carga de leads desde Vicidial
    const mockLeads: Lead[] = [
      {
        id: "1",
        vendorLeadCode: "CRM_001",
        firstName: "Roberto",
        lastName: "Silva",
        phoneNumber: "+1-555-0123",
        email: "roberto.silva@email.com",
        status: "NEW",
        source: "Website",
        entryDate: "2025-05-30",
        callCount: 0,
        comments: "Lead generado desde formulario web",
        priority: 5
      },
      {
        id: "2",
        vendorLeadCode: "CRM_002",
        firstName: "Ana",
        lastName: "Martínez",
        phoneNumber: "+1-555-0456",
        email: "ana.martinez@email.com",
        status: "CALLBACK",
        source: "Campaign",
        entryDate: "2025-05-29",
        lastCallDate: "2025-05-30",
        callCount: 2,
        comments: "Interesada, solicita llamar mañana",
        priority: 8
      }
    ];
    setLeads(mockLeads);
  }, []);

  const handleAddLead = async () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.phoneNumber) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const lead: Lead = {
      id: Date.now().toString(),
      vendorLeadCode: `CRM_${Date.now()}`,
      firstName: newLead.firstName || "",
      lastName: newLead.lastName || "",
      phoneNumber: newLead.phoneNumber || "",
      email: newLead.email || "",
      status: "NEW",
      source: newLead.source || "Manual",
      entryDate: new Date().toISOString().split('T')[0],
      callCount: 0,
      comments: newLead.comments || "",
      priority: newLead.priority || 5
    };

    // Simular sincronización con Vicidial
    console.log("Sincronizando lead con Vicidial:", lead);
    
    setLeads(prev => [lead, ...prev]);
    setNewLead({});
    setIsAddLeadOpen(false);
    
    toast({
      title: "Lead Agregado",
      description: "Lead sincronizado exitosamente con Vicidial",
    });
  };

  const handleCall = (lead: Lead) => {
    console.log("Iniciando llamada a:", lead.phoneNumber);
    toast({
      title: "Llamada Iniciada",
      description: `Marcando a ${lead.firstName} ${lead.lastName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500';
      case 'CALLBACK':
        return 'bg-yellow-500';
      case 'SALE':
        return 'bg-green-500';
      case 'NOT_INTERESTED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneNumber.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gestión de Leads ({leads.length})
            </div>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={newLead.firstName || ""}
                        onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={newLead.lastName || ""}
                        onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Teléfono *</Label>
                    <Input
                      id="phoneNumber"
                      value={newLead.phoneNumber || ""}
                      onChange={(e) => setNewLead({...newLead, phoneNumber: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newLead.email || ""}
                      onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="source">Fuente</Label>
                    <Select onValueChange={(value) => setNewLead({...newLead, source: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar fuente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Campaign">Campaña</SelectItem>
                        <SelectItem value="Referral">Referido</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="comments">Comentarios</Label>
                    <Textarea
                      id="comments"
                      value={newLead.comments || ""}
                      onChange={(e) => setNewLead({...newLead, comments: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={handleAddLead} className="w-full">
                    Agregar Lead
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="NEW">Nuevo</SelectItem>
                <SelectItem value="CALLBACK">Callback</SelectItem>
                <SelectItem value="SALE">Venta</SelectItem>
                <SelectItem value="NOT_INTERESTED">No Interesado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Leads */}
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{lead.phoneNumber}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                    <Badge className={`${getStatusColor(lead.status)} text-white`}>
                      {lead.status}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleCall(lead)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <span>Fuente: {lead.source}</span>
                      <span>Llamadas: {lead.callCount}</span>
                      <span>Prioridad: {lead.priority}/10</span>
                    </div>
                    <span>Creado: {lead.entryDate}</span>
                  </div>
                  {lead.comments && (
                    <p className="mt-2 italic">"{lead.comments}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
