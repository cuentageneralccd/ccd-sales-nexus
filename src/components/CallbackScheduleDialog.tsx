
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock } from 'lucide-react';

interface CallbackScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: string, notes: string) => void;
  leadName: string;
}

export const CallbackScheduleDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSchedule, 
  leadName 
}: CallbackScheduleDialogProps) => {
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSchedule = () => {
    if (!callbackDate || !callbackTime) return;
    
    const fullDateTime = `${callbackDate}T${callbackTime}:00.000Z`;
    onSchedule(fullDateTime, notes);
    
    // Reset form
    setCallbackDate('');
    setCallbackTime('');
    setNotes('');
    onOpenChange(false);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Programar Callback - {leadName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="callback-date">Fecha</Label>
            <Input
              id="callback-date"
              type="date"
              min={minDate}
              value={callbackDate}
              onChange={(e) => setCallbackDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="callback-time">Hora</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Input
                id="callback-time"
                type="time"
                value={callbackTime}
                onChange={(e) => setCallbackTime(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="callback-notes">Notas del Callback</Label>
            <Textarea
              id="callback-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo del callback, temas a discutir, etc..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSchedule}
              disabled={!callbackDate || !callbackTime}
              className="flex-1"
            >
              Programar Callback
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
