
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Phone, Edit, Trash2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/hooks/useLeads";
import { CallbackScheduleDialog } from "@/components/CallbackScheduleDialog";
import { LeadForm } from "@/components/LeadForm";
import { LeadKPIs } from "@/components/LeadKPIs";
import { LeadFilters } from "@/components/LeadFilters";

export const LeadsManager = () => {
  const { 
    leads, 
    isLoading, 
    filters, 
    setFilters, 
    addLead, 
    updateLead,
    deleteLead,
    scheduleCallback,
    callLead,
    getLeadsByStatus,
    getLeadsBySource,
    getHighPriorityLeads
  } = useLeads();

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);

  const handleEditLead = async (updates: any) => {
    if (selectedLead) {
      await updateLead(selectedLead.id, updates);
      setIsEditDialogOpen(false);
      setSelectedLead(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    await deleteLead(leadId);
  };

  const handleScheduleCallback = async (date: string, notes: string) => {
    if (selectedLead) {
      await scheduleCallback(selectedLead.id, date, notes);
    }
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
  const highPriorityLeads = getHighPriorityLeads();

  return (
    <div className="space-y-6">
      <LeadKPIs
        totalLeads={leads.length}
        newLeads={statusStats.NEW || 0}
        sales={statusStats.SALE || 0}
        highPriorityCount={highPriorityLeads.length}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gestión de Leads ({leads.length})
              {isLoading && <span className="ml-2 text-sm text-gray-500">Sincronizando...</span>}
            </div>
            <Button onClick={() => setIsAddLeadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Lead
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeadFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

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
                      onClick={() => callLead(lead)}
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsCallbackDialogOpen(true);
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar Lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el lead 
                            {lead.firstName} {lead.lastName} y todos sus datos asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

      <LeadForm
        isOpen={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onSubmit={addLead}
        isLoading={isLoading}
      />

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

      <CallbackScheduleDialog
        isOpen={isCallbackDialogOpen}
        onOpenChange={setIsCallbackDialogOpen}
        onSchedule={handleScheduleCallback}
        leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : ''}
      />
    </div>
  );
};
