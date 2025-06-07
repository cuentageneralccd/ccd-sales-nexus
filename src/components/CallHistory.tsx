
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Phone, Search, Filter } from "lucide-react";

interface CallRecord {
  id: string;
  agentName: string;
  phoneNumber: string;
  leadName: string;
  campaign: string;
  startTime: string;
  endTime: string;
  duration: number;
  outcome: 'SALE' | 'CALLBACK' | 'NO_ANSWER' | 'NOT_INTERESTED' | 'APPOINTMENT';
  disposition: string;
}

export const CallHistory = () => {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<CallRecord[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    outcome: 'all',
    agent: 'all'
  });

  useEffect(() => {
    // Simulate call history data
    const simulatedHistory: CallRecord[] = [
      {
        id: 'call_hist_1',
        agentName: 'María González',
        phoneNumber: '3001234567',
        leadName: 'Juan Pérez',
        campaign: 'VENTAS_PREMIUM',
        startTime: '2024-01-15 14:20:00',
        endTime: '2024-01-15 14:25:30',
        duration: 330,
        outcome: 'SALE',
        disposition: 'VENTA EXITOSA'
      },
      {
        id: 'call_hist_2',
        agentName: 'Carlos Rodríguez',
        phoneNumber: '3109876543',
        leadName: 'Ana López',
        campaign: 'VENTAS_PREMIUM',
        startTime: '2024-01-15 13:45:00',
        endTime: '2024-01-15 13:48:15',
        duration: 195,
        outcome: 'CALLBACK',
        disposition: 'CALLBACK PROGRAMADO'
      },
      {
        id: 'call_hist_3',
        agentName: 'María González',
        phoneNumber: '3201122334',
        leadName: 'Pedro García',
        campaign: 'VENTAS_PREMIUM',
        startTime: '2024-01-15 12:30:00',
        endTime: '2024-01-15 12:30:45',
        duration: 45,
        outcome: 'NO_ANSWER',
        disposition: 'NO CONTESTA'
      }
    ];

    setCallHistory(simulatedHistory);
    setFilteredCalls(simulatedHistory);
  }, []);

  useEffect(() => {
    let filtered = callHistory;

    if (filters.search) {
      filtered = filtered.filter(call =>
        call.leadName.toLowerCase().includes(filters.search.toLowerCase()) ||
        call.phoneNumber.includes(filters.search) ||
        call.agentName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.outcome !== 'all') {
      filtered = filtered.filter(call => call.outcome === filters.outcome);
    }

    if (filters.agent !== 'all') {
      filtered = filtered.filter(call => call.agentName === filters.agent);
    }

    setFilteredCalls(filtered);
  }, [filters, callHistory]);

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'SALE': return 'bg-green-500';
      case 'APPOINTMENT': return 'bg-blue-500';
      case 'CALLBACK': return 'bg-yellow-500';
      case 'NOT_INTERESTED': return 'bg-red-500';
      case 'NO_ANSWER': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const uniqueAgents = [...new Set(callHistory.map(call => call.agentName))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Historial de Llamadas ({filteredCalls.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Buscar por lead, teléfono o asesor..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full"
            />
          </div>
          <Select value={filters.outcome} onValueChange={(value) => setFilters({...filters, outcome: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Resultados</SelectItem>
              <SelectItem value="SALE">Ventas</SelectItem>
              <SelectItem value="APPOINTMENT">Citas</SelectItem>
              <SelectItem value="CALLBACK">Callbacks</SelectItem>
              <SelectItem value="NOT_INTERESTED">No Interesados</SelectItem>
              <SelectItem value="NO_ANSWER">No Contesta</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.agent} onValueChange={(value) => setFilters({...filters, agent: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por asesor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Asesores</SelectItem>
              {uniqueAgents.map((agent) => (
                <SelectItem key={agent} value={agent}>{agent}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Call History List */}
        <div className="space-y-3">
          {filteredCalls.map((call) => (
            <div key={call.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{call.leadName}</span>
                  <span className="text-gray-500">-</span>
                  <span className="text-sm">{call.phoneNumber}</span>
                </div>
                <Badge className={`${getOutcomeColor(call.outcome)} text-white text-xs`}>
                  {call.outcome}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                <div>
                  <span className="font-medium">Asesor:</span> {call.agentName}
                </div>
                <div>
                  <span className="font-medium">Duración:</span> {formatDuration(call.duration)}
                </div>
                <div>
                  <span className="font-medium">Hora:</span> {call.startTime.split(' ')[1]}
                </div>
                <div>
                  <span className="font-medium">Campaña:</span> {call.campaign}
                </div>
              </div>
              
              <div className="text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium">Disposición:</span> {call.disposition}
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Ver Detalles
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Escuchar Grabación
                </Button>
              </div>
            </div>
          ))}
          
          {filteredCalls.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron llamadas con los filtros aplicados</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
