
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Search, Filter, Download } from "lucide-react";

interface CallRecord {
  id: string;
  phoneNumber: string;
  contactName: string;
  agentName: string;
  startTime: string;
  duration: number;
  status: string;
  disposition: string;
  comments: string;
}

export const CallHistory = () => {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simular historial de llamadas
    const mockHistory: CallRecord[] = [
      {
        id: "call_h001",
        phoneNumber: "+1-555-0123",
        contactName: "Roberto Silva",
        agentName: "María García",
        startTime: "2025-05-30 13:45:00",
        duration: 245,
        status: "COMPLETED",
        disposition: "SALE",
        comments: "Cliente interesado en producto premium"
      },
      {
        id: "call_h002",
        phoneNumber: "+1-555-0456",
        contactName: "Ana Martínez",
        agentName: "Juan Pérez",
        startTime: "2025-05-30 13:30:00",
        duration: 120,
        status: "COMPLETED",
        disposition: "CALLBACK",
        comments: "Solicita llamar mañana por la tarde"
      },
      {
        id: "call_h003",
        phoneNumber: "+1-555-0789",
        contactName: "Carlos Rodríguez",
        agentName: "Carlos López",
        startTime: "2025-05-30 13:15:00",
        duration: 0,
        status: "NO_ANSWER",
        disposition: "NA",
        comments: "No contestó"
      }
    ];
    setCallHistory(mockHistory);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case 'SALE':
        return 'bg-green-500';
      case 'CALLBACK':
        return 'bg-blue-500';
      case 'NOT_INTERESTED':
        return 'bg-red-500';
      case 'NA':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const filteredHistory = callHistory.filter(call => {
    const matchesSearch = call.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Historial de Llamadas
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre o teléfono..."
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
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="COMPLETED">Completadas</SelectItem>
              <SelectItem value="NO_ANSWER">Sin respuesta</SelectItem>
              <SelectItem value="BUSY">Ocupado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de llamadas */}
        <div className="space-y-3">
          {filteredHistory.map((call) => (
            <div
              key={call.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{call.contactName}</p>
                    <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                  </div>
                  <Badge className={`${getDispositionColor(call.disposition)} text-white`}>
                    {call.disposition}
                  </Badge>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{new Date(call.startTime).toLocaleTimeString()}</p>
                  <p>{formatDuration(call.duration)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Agente: {call.agentName}</span>
                  {call.comments && (
                    <span className="text-gray-600">"{call.comments}"</span>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
