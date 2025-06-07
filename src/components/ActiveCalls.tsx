
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, PhoneCall, Clock, User } from "lucide-react";

interface ActiveCall {
  id: string;
  agentName: string;
  phoneNumber: string;
  leadName: string;
  campaign: string;
  startTime: string;
  duration: number;
  status: 'CONNECTED' | 'RINGING' | 'ON_HOLD';
}

export const ActiveCalls = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);

  // Simulate active calls data
  useEffect(() => {
    const simulatedCalls: ActiveCall[] = [
      {
        id: 'call_1',
        agentName: 'María González',
        phoneNumber: '3001234567',
        leadName: 'Juan Pérez',
        campaign: 'VENTAS_PREMIUM',
        startTime: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        duration: 180,
        status: 'CONNECTED'
      },
      {
        id: 'call_2',
        agentName: 'Carlos Rodríguez',
        phoneNumber: '3109876543',
        leadName: 'Ana López',
        campaign: 'VENTAS_PREMIUM',
        startTime: new Date(Date.now() - 45000).toISOString(), // 45 seconds ago
        duration: 45,
        status: 'RINGING'
      }
    ];

    setActiveCalls(simulatedCalls);

    // Update duration every second
    const interval = setInterval(() => {
      setActiveCalls(prev => prev.map(call => ({
        ...call,
        duration: Math.floor((Date.now() - new Date(call.startTime).getTime()) / 1000)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-500';
      case 'RINGING': return 'bg-yellow-500';
      case 'ON_HOLD': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PhoneCall className="h-5 w-5 mr-2" />
          Llamadas Activas ({activeCalls.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeCalls.map((call) => (
            <div key={call.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{call.agentName}</span>
                </div>
                <Badge className={`${getStatusColor(call.status)} text-white text-xs`}>
                  {call.status}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <span>{call.phoneNumber}</span>
                  <span className="text-gray-500">-</span>
                  <span className="font-medium">{call.leadName}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Campaña: {call.campaign}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(call.duration)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Monitorear
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Transferir
                </Button>
              </div>
            </div>
          ))}
          
          {activeCalls.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <PhoneCall className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay llamadas activas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
