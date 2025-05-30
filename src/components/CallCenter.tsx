
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, PhoneCall, Clock, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AgentPanel } from "./AgentPanel";
import { ActiveCalls } from "./ActiveCalls";
import { CallHistory } from "./CallHistory";

export const CallCenter = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleClickToDial = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número telefónico",
        variant: "destructive",
      });
      return;
    }

    // Simular llamada a API de Vicidial
    console.log("Iniciando llamada click-to-dial:", phoneNumber);
    
    try {
      // Aquí iría la llamada real a la API de Vicidial
      // await vicidialAPI.externalDial(phoneNumber, selectedAgent);
      
      toast({
        title: "Llamada Iniciada",
        description: `Marcando al ${phoneNumber}`,
      });
      
      setPhoneNumber("");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la llamada",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Dial Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Panel de Marcación Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Número telefónico"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleClickToDial} className="px-8">
              <PhoneCall className="h-4 w-4 mr-2" />
              Llamar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Panel */}
        <div className="lg:col-span-1">
          <AgentPanel 
            selectedAgent={selectedAgent}
            onAgentSelect={setSelectedAgent}
          />
        </div>

        {/* Active Calls */}
        <div className="lg:col-span-2">
          <ActiveCalls />
        </div>
      </div>

      {/* Call History */}
      <CallHistory />
    </div>
  );
};
