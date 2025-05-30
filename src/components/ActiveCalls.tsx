
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, User, MessageSquare } from "lucide-react";

interface ActiveCall {
  id: string;
  agentName: string;
  phoneNumber: string;
  contactName: string;
  startTime: string;
  duration: number;
  status: 'RINGING' | 'CONNECTED' | 'ON_HOLD';
  leadId: string;
}

export const ActiveCalls = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);

  useEffect(() => {
    // Simular llamadas activas
    const mockCalls: ActiveCall[] = [
      {
        id: "call_001",
        agentName: "María García",
        phoneNumber: "+1-555-0123",
        contactName: "Roberto Silva",
        startTime: "14:23:15",
        duration: 185,
        status: "CONNECTED",
        leadId: "lead_123"
      },
      {
        id: "call_002",
        agentName: "Juan Pérez",
        phoneNumber: "+1-555-0456",
        contactName: "Ana Martínez",
        startTime: "14:25:30",
        duration: 45,
        status: "RINGING",
        leadId: "lead_456"
      }
    ];
    setActiveCalls(mockCalls);

    // Actualizar duración cada segundo
    const interval = setInterval(() => {
      setActiveCalls(prev => prev.map(call => ({
        ...call,
        duration: call.status === 'CONNECTED' ? call.duration + 1 : call.duration
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: ActiveCall['status']) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'RINGING':
        return 'bg-yellow-500';
      case 'ON_HOLD':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ActiveCall['status']) => {
    switch (status) {
      case 'CONNECTED':
        return 'Conectado';
      case 'RINGING':
        return 'Timbrando';
      case 'ON_HOLD':
        return 'En Espera';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Llamadas Activas ({activeCalls.length})
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeCalls.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay llamadas activas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCalls.map((call) => (
              <div
                key={call.id}
                className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p className="font-medium">{call.contactName}</p>
                      <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(call.status)} text-white`}>
                    {getStatusText(call.status)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{call.agentName}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{formatDuration(call.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => console.log('Ver perfil del lead:', call.leadId)}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
