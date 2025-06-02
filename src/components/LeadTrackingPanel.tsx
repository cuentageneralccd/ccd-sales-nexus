
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Search, 
  User, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  DollarSign
} from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

export const LeadTrackingPanel = () => {
  const { 
    getLeadByPhoneNumber,
    getLeadPromotions,
    getLeadInteractionHistory,
    addPromotionInterest,
    updatePromotionStatus,
    activateLead,
    recordInteraction,
    isLoading
  } = useLeads();

  const [searchPhone, setSearchPhone] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadPromotions, setLeadPromotions] = useState<any[]>([]);
  const [leadInteractions, setLeadInteractions] = useState<any[]>([]);
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [newPromotion, setNewPromotion] = useState<any>({});
  const [newInteraction, setNewInteraction] = useState<any>({});
  const { toast } = useToast();

  const handleSearchLead = () => {
    if (!searchPhone) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número telefónico",
        variant: "destructive",
      });
      return;
    }

    const lead = getLeadByPhoneNumber(searchPhone);
    if (lead) {
      setSelectedLead(lead);
      setLeadPromotions(getLeadPromotions(searchPhone));
      setLeadInteractions(getLeadInteractionHistory(searchPhone));
    } else {
      toast({
        title: "Lead No Encontrado",
        description: "No se encontró ningún lead con ese número telefónico",
        variant: "destructive",
      });
      setSelectedLead(null);
      setLeadPromotions([]);
      setLeadInteractions([]);
    }
  };

  const handleActivateLead = async () => {
    if (selectedLead && !selectedLead.isActive) {
      await activateLead(selectedLead.phoneNumber, 'asesor1'); // Usar asesor actual
      
      // Actualizar la vista
      const updatedLead = getLeadByPhoneNumber(selectedLead.phoneNumber);
      setSelectedLead(updatedLead);
    }
  };

  const handleAddPromotion = async () => {
    if (!newPromotion.promotionName) {
      toast({
        title: "Error",
        description: "Por favor completa los datos de la promoción",
        variant: "destructive",
      });
      return;
    }

    await addPromotionInterest(selectedLead.phoneNumber, {
      promotionId: `PROM_${Date.now()}`,
      promotionName: newPromotion.promotionName,
      interestLevel: newPromotion.interestLevel || 5,
      notes: newPromotion.notes || ''
    });

    setLeadPromotions(getLeadPromotions(selectedLead.phoneNumber));
    setNewPromotion({});
    setIsAddPromotionOpen(false);
  };

  const handleUpdatePromotionStatus = async (promotionId: string, status: string) => {
    await updatePromotionStatus(promotionId, status as any);
    setLeadPromotions(getLeadPromotions(selectedLead.phoneNumber));
  };

  const handleAddInteraction = async () => {
    if (!newInteraction.interactionType || !newInteraction.notes) {
      toast({
        title: "Error",
        description: "Por favor completa los datos de la interacción",
        variant: "destructive",
      });
      return;
    }

    await recordInteraction({
      leadId: selectedLead.id,
      phoneNumber: selectedLead.phoneNumber,
      advisorId: 'asesor1', // Usar asesor actual
      interactionType: newInteraction.interactionType,
      outcome: newInteraction.outcome || 'CONTACT_MADE',
      notes: newInteraction.notes,
      duration: parseInt(newInteraction.duration) || 0,
      promotionsDiscussed: newInteraction.promotionsDiscussed?.split(',') || []
    });

    setLeadInteractions(getLeadInteractionHistory(selectedLead.phoneNumber));
    setNewInteraction({});
    setIsAddInteractionOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INTERESTED': return 'bg-blue-500';
      case 'PRESENTED': return 'bg-purple-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'SALE': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'APPOINTMENT_SET': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'CONTACT_MADE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'NO_ANSWER': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Búsqueda por Teléfono */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Seguimiento de Lead por Número Telefónico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Ingresa el número telefónico (ej: 3001234567)"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearchLead} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Buscar Lead
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedLead && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Lead */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información del Lead
                </div>
                {!selectedLead.isActive && (
                  <Button size="sm" onClick={handleActivateLead}>
                    <Target className="h-4 w-4 mr-2" />
                    Activar Lead
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nombre Completo</Label>
                  <p className="text-lg font-semibold">{selectedLead.firstName} {selectedLead.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Teléfono</Label>
                  <p className="font-medium">{selectedLead.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estado</Label>
                  <Badge className={`${getStatusColor(selectedLead.status)} text-white`}>
                    {selectedLead.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Fuente</Label>
                  <p className="font-medium">{selectedLead.source}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Código de Campaña</Label>
                  <p className="font-medium text-blue-600">{selectedLead.campaignOriginCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Score</Label>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{selectedLead.score}/100</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estado de Activación</Label>
                  <Badge variant={selectedLead.isActive ? "default" : "secondary"}>
                    {selectedLead.isActive ? "ACTIVO" : "INACTIVO"}
                  </Badge>
                </div>
              </div>
              
              {selectedLead.comments && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Comentarios</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedLead.comments}</p>
                </div>
              )}
              
              {selectedLead.activationDate && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Fecha de Activación</Label>
                  <p className="text-sm">{new Date(selectedLead.activationDate).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Activado por: {selectedLead.activatedBy}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Promociones del Lead */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Promociones ({leadPromotions.length})
                </div>
                <Dialog open={isAddPromotionOpen} onOpenChange={setIsAddPromotionOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Agregar Promoción
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Interés en Promoción</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre de la Promoción</Label>
                        <Input
                          value={newPromotion.promotionName || ""}
                          onChange={(e) => setNewPromotion({...newPromotion, promotionName: e.target.value})}
                          placeholder="Ej: Seguro de Vida 50% Descuento"
                        />
                      </div>
                      <div>
                        <Label>Nivel de Interés (1-10)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={newPromotion.interestLevel || 5}
                          onChange={(e) => setNewPromotion({...newPromotion, interestLevel: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Notas</Label>
                        <Textarea
                          value={newPromotion.notes || ""}
                          onChange={(e) => setNewPromotion({...newPromotion, notes: e.target.value})}
                          placeholder="Comentarios sobre el interés del cliente..."
                        />
                      </div>
                      <Button onClick={handleAddPromotion} className="w-full">
                        Registrar Interés
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leadPromotions.map((promotion) => (
                  <div key={promotion.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{promotion.promotionName}</h4>
                      <Badge className={`${getStatusColor(promotion.status)} text-white text-xs`}>
                        {promotion.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div>Interés: {promotion.interestLevel}/10</div>
                      <div>Mostrada: {new Date(promotion.dateShown).toLocaleDateString()}</div>
                    </div>
                    {promotion.notes && (
                      <p className="text-sm bg-gray-50 p-2 rounded mb-2">{promotion.notes}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdatePromotionStatus(promotion.id, 'PRESENTED')}
                        disabled={promotion.status === 'PRESENTED'}
                      >
                        Presentada
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdatePromotionStatus(promotion.id, 'ACCEPTED')}
                        disabled={promotion.status === 'ACCEPTED'}
                      >
                        Aceptada
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdatePromotionStatus(promotion.id, 'REJECTED')}
                        disabled={promotion.status === 'REJECTED'}
                      >
                        Rechazada
                      </Button>
                    </div>
                  </div>
                ))}
                
                {leadPromotions.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay promociones registradas para este lead</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedLead && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Historial de Interacciones ({leadInteractions.length})
              </div>
              <Dialog open={isAddInteractionOpen} onOpenChange={setIsAddInteractionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Registrar Interacción
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Interacción</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Interacción</Label>
                      <Select onValueChange={(value) => setNewInteraction({...newInteraction, interactionType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CALL">Llamada</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                          <SelectItem value="MEETING">Reunión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Resultado</Label>
                      <Select onValueChange={(value) => setNewInteraction({...newInteraction, outcome: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar resultado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CONTACT_MADE">Contacto Exitoso</SelectItem>
                          <SelectItem value="NO_ANSWER">No Contestó</SelectItem>
                          <SelectItem value="BUSY">Ocupado</SelectItem>
                          <SelectItem value="VOICEMAIL">Buzón de Voz</SelectItem>
                          <SelectItem value="APPOINTMENT_SET">Cita Agendada</SelectItem>
                          <SelectItem value="SALE">Venta</SelectItem>
                          <SelectItem value="NOT_INTERESTED">No Interesado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Duración (minutos)</Label>
                      <Input
                        type="number"
                        value={newInteraction.duration || ""}
                        onChange={(e) => setNewInteraction({...newInteraction, duration: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Promociones Discutidas (separadas por coma)</Label>
                      <Input
                        value={newInteraction.promotionsDiscussed || ""}
                        onChange={(e) => setNewInteraction({...newInteraction, promotionsDiscussed: e.target.value})}
                        placeholder="PROM001, PROM002"
                      />
                    </div>
                    <div>
                      <Label>Notas</Label>
                      <Textarea
                        value={newInteraction.notes || ""}
                        onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                        placeholder="Detalles de la interacción..."
                      />
                    </div>
                    <Button onClick={handleAddInteraction} className="w-full">
                      Registrar Interacción
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadInteractions.map((interaction) => (
                <div key={interaction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getOutcomeIcon(interaction.outcome)}
                      <span className="font-medium">{interaction.interactionType}</span>
                      <Badge variant="outline">{interaction.outcome}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(interaction.date).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium">Duración:</span> {interaction.duration} min
                    </div>
                    <div>
                      <span className="font-medium">Asesor:</span> {interaction.advisorId}
                    </div>
                    {interaction.promotionsDiscussed?.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium">Promociones:</span> {interaction.promotionsDiscussed.join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{interaction.notes}</p>
                  </div>
                  
                  {interaction.nextAction && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm">
                        <span className="font-medium">Próxima acción:</span> {interaction.nextAction}
                        {interaction.nextActionDate && (
                          <span className="text-gray-500 ml-2">
                            ({new Date(interaction.nextActionDate).toLocaleDateString()})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {leadInteractions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay interacciones registradas para este lead</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
