
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Clock, Users } from "lucide-react";
import { vicidialService, VicidialAgent } from "@/services/vicidialService";

interface AgentPanelProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

export const AgentPanel = ({ selectedAgent, onAgentSelect }: AgentPanelProps) => {
  const [agents, setAgents] = useState<VicidialAgent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const agentData = await vicidialService.getLoggedInAgents();
      setAgents(agentData);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-500';
      case 'INCALL': return 'bg-blue-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'DISPO': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePauseAgent = async (agentId: string) => {
    try {
      await vicidialService.pauseAgent(agentId, 'BREAK');
      await loadAgents();
    } catch (error) {
      console.error('Error pausing agent:', error);
    }
  };

  const handleUnpauseAgent = async (agentId: string) => {
    try {
      await vicidialService.unpauseAgent(agentId);
      await loadAgents();
    } catch (error) {
      console.error('Error unpausing agent:', error);
    }
  };

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Panel de Asesores ({agents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.user}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAgent === agent.user ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
              }`}
              onClick={() => onAgentSelect(agent.user)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{agent.fullName}</span>
                </div>
                <Badge className={`${getStatusColor(agent.status)} text-white text-xs`}>
                  {agent.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {agent.callsToday} llamadas
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor(agent.talkTimeToday / 60)}m hablado
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-2">
                Campaña: {agent.campaign} | Ext: {agent.phone_login}
              </div>
              
              <div className="flex space-x-2">
                {agent.status === 'PAUSED' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnpauseAgent(agent.user);
                    }}
                    disabled={isLoading}
                  >
                    Activar
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePauseAgent(agent.user);
                    }}
                    disabled={isLoading || agent.status === 'INCALL'}
                  >
                    Pausar
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {agents.length === 0 && !isLoading && (
            <div className="text-center py-4 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay asesores conectados</p>
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-4 text-gray-500">
              <p>Cargando asesores...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
