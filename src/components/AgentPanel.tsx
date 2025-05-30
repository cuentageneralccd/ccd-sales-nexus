
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, Clock, Activity } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  status: 'READY' | 'INCALL' | 'PAUSED' | 'OFFLINE';
  extension: string;
  callsToday: number;
  avgCallTime: number;
  loginTime: string;
}

interface AgentPanelProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

export const AgentPanel = ({ selectedAgent, onAgentSelect }: AgentPanelProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Simular carga de agentes desde Vicidial
    const mockAgents: Agent[] = [
      {
        id: "john001",
        name: "Juan Pérez",
        status: "READY",
        extension: "101",
        callsToday: 45,
        avgCallTime: 180,
        loginTime: "08:30"
      },
      {
        id: "maria002",
        name: "María García",
        status: "INCALL",
        extension: "102",
        callsToday: 38,
        avgCallTime: 165,
        loginTime: "08:15"
      },
      {
        id: "carlos003",
        name: "Carlos López",
        status: "PAUSED",
        extension: "103",
        callsToday: 42,
        avgCallTime: 195,
        loginTime: "09:00"
      }
    ];
    setAgents(mockAgents);
  }, []);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'READY':
        return 'bg-green-500';
      case 'INCALL':
        return 'bg-blue-500';
      case 'PAUSED':
        return 'bg-yellow-500';
      case 'OFFLINE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'READY':
        return 'Disponible';
      case 'INCALL':
        return 'En Llamada';
      case 'PAUSED':
        return 'En Pausa';
      case 'OFFLINE':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Agentes Activos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAgent === agent.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onAgentSelect(agent.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-600">Ext. {agent.extension}</p>
                </div>
              </div>
              <Badge 
                className={`${getStatusColor(agent.status)} text-white text-xs`}
              >
                {getStatusText(agent.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Phone className="h-3 w-3 mr-1" />
                </div>
                <p className="font-medium">{agent.callsToday}</p>
                <p className="text-gray-600">Llamadas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                </div>
                <p className="font-medium">{Math.floor(agent.avgCallTime / 60)}m</p>
                <p className="text-gray-600">Promedio</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Activity className="h-3 w-3 mr-1" />
                </div>
                <p className="font-medium">{agent.loginTime}</p>
                <p className="text-gray-600">Login</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
