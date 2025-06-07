
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (leadData: any) => void;
  isLoading: boolean;
}

export const LeadForm = ({ isOpen, onOpenChange, onSubmit, isLoading }: LeadFormProps) => {
  const [newLead, setNewLead] = useState<any>({});

  const handleSubmit = () => {
    if (!newLead.firstName || !newLead.lastName || !newLead.phoneNumber) {
      return;
    }

    onSubmit(newLead);
    setNewLead({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? "Agregando..." : "Agregar Lead"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
