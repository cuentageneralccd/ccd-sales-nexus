
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Search, Phone, Edit, Trash2, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";

export const LeadsManager = () => {
  const { 
    leads, 
    isLoading, 
    filters, 
    setFilters, 
    addLead, 
    updateLead, 
    callLead,
    getLeadsByStatus,
    getLeadsBySource,
    getHighPriorityLeads
  } = useLeads();

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState<any>({});
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddLead = async () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.phoneNumber) {
      return;
    }

    await addLead(newLead);
    setNewLead({});
    setIsAddLeadOpen(false);
  };

  const handleEditLead = async (updates: any) => {
    if (selectedLead) {
      await updateLead(selectedLead.id, updates);
      setIsEditDialogOpen(false);
      setSelectedLead(null);
    }
  };

  const handleCallLead = async (lead: any) => {
    await callLead(lead);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'CONTACTED': return 'bg-purple-500';
      case 'CALLBACK': return 'bg-yellow-500';
      case 'SALE': return 'bg-green-500';
      case 'NOT_INTERESTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 font-bold';
    if (priority >= 6) return 'text-orange-600 font-medium';
    return 'text-gray-600';
  };

  const statusStats = getLeadsByStatus();
  const sourceStats = getLeadsBySource();
  const highPriorityLeads = getHighPriorityLeads();

  return (
    <div className="space-y-6">
      {/* KPIs de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuevos Hoy</p>
                <p className="text-2xl font-bold">{statusStats.NEW || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas</p>
                <p className="text-2xl font-bold">{statusStats.SALE || 0}</p>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Prioridad</p>
                <p className="text-2xl font-bold">{highPriorityLeads.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gestión de Leads ({leads.length})
              {isLoading && <span className="ml-2 text-sm text-gray-500">Sincronizando...</span>}
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
                        <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                        <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referido">Referido</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridad (1-10)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={newLead.priority || 5}
                      onChange={(e) => setNewLead({...newLead, priority: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="comments">Comentarios</Label>
                    <Textarea
                      id="comments"
                      value={newLead.comments || ""}
                      onChange={(e) => setNewLead({...newLead, comments: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={handleAddLead} className="w-full" disabled={isLoading}>
                    {isLoading ? "Agregando..." : "Agregar Lead"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros Avanzados */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Buscar por nombre, teléfono o email..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="NEW">Nuevos</SelectItem>
                <SelectItem value="CONTACTED">Contactados</SelectItem>
                <SelectItem value="CALLBACK">Callbacks</SelectItem>
                <SelectItem value="SALE">Ventas</SelectItem>
                <SelectItem value="NOT_INTERESTED">No Interesados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las Fuentes</SelectItem>
                <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referido">Referido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Leads Mejorada */}
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-lg">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <Badge className={`${getStatusColor(lead.status)} text-white text-xs`}>
                          {lead.status}
                        </Badge>
                        <span className={`text-sm ${getPriorityColor(lead.priority)}`}>
                          Prioridad: {lead.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{lead.phoneNumber}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleCallLead(lead)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Fuente:</span> {lead.source}
                  </div>
                  <div>
                    <span className="font-medium">Llamadas:</span> {lead.callCount}
                  </div>
                  <div>
                    <span className="font-medium">Score:</span> {lead.score}/100
                  </div>
                  <div>
                    <span className="font-medium">Creado:</span> {lead.entryDate}
                  </div>
                </div>
                
                {lead.comments && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm italic">
                    "{lead.comments}"
                  </div>
                )}
                
                {lead.lastCallDate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Última llamada: {lead.lastCallDate}
                  </div>
                )}
              </div>
            ))}
          </div>

          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron leads con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <Label>Estado</Label>
                <Select 
                  value={selectedLead.status} 
                  onValueChange={(value) => setSelectedLead({...selectedLead, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Nuevo</SelectItem>
                    <SelectItem value="CONTACTED">Contactado</SelectItem>
                    <SelectItem value="CALLBACK">Callback</SelectItem>
                    <SelectItem value="SALE">Venta</SelectItem>
                    <SelectItem value="NOT_INTERESTED">No Interesado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Comentarios</Label>
                <Textarea
                  value={selectedLead.comments || ""}
                  onChange={(e) => setSelectedLead({...selectedLead, comments: e.target.value})}
                  placeholder="Agregar comentarios sobre el lead..."
                />
              </div>
              
              <div>
                <Label>Prioridad (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={selectedLead.priority || 5}
                  onChange={(e) => setSelectedLead({...selectedLead, priority: parseInt(e.target.value)})}
                />
              </div>
              
              <Button 
                onClick={() => handleEditLead(selectedLead)} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
