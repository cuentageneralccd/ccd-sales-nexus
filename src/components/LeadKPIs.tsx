
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Phone, AlertCircle } from "lucide-react";

interface LeadKPIsProps {
  totalLeads: number;
  newLeads: number;
  sales: number;
  highPriorityCount: number;
}

export const LeadKPIs = ({ totalLeads, newLeads, sales, highPriorityCount }: LeadKPIsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuevos Hoy</p>
              <p className="text-2xl font-bold">{newLeads}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas</p>
              <p className="text-2xl font-bold">{sales}</p>
            </div>
            <Phone className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alta Prioridad</p>
              <p className="text-2xl font-bold">{highPriorityCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
