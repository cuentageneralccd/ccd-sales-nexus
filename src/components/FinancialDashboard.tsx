
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Target, Calculator, PieChart, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Cell, LineChart, Line } from "recharts";

interface FinancialMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  costPerLead: number;
  roi: number;
  commissions: number;
  projectedRevenue: number;
}

interface RevenueBySource {
  source: string;
  revenue: number;
  cost: number;
  roi: number;
  color: string;
}

export const FinancialDashboard = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 425000,
    monthlyGrowth: 15.8,
    costPerLead: 45,
    roi: 320,
    commissions: 38500,
    projectedRevenue: 490000
  });

  const [revenueBySource] = useState<RevenueBySource[]>([
    { source: "Meta Ads", revenue: 180000, cost: 45000, roi: 300, color: "#1877F2" },
    { source: "Google Ads", revenue: 120000, cost: 35000, roi: 243, color: "#4285F4" },
    { source: "TikTok Ads", revenue: 85000, cost: 28000, roi: 204, color: "#000000" },
    { source: "Orgánico", revenue: 40000, cost: 5000, roi: 700, color: "#10B981" }
  ]);

  const monthlyTrend = [
    { month: "Ene", revenue: 320000, costs: 85000 },
    { month: "Feb", revenue: 345000, costs: 88000 },
    { month: "Mar", revenue: 380000, costs: 92000 },
    { month: "Abr", revenue: 410000, costs: 95000 },
    { month: "May", revenue: 425000, costs: 98000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión Financiera</h2>
        <div className="flex space-x-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular ROI
          </Button>
        </div>
      </div>

      {/* KPIs Financieros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.monthlyGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.roi}%</div>
            <p className="text-xs text-muted-foreground">
              Retorno de inversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo por Lead</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.costPerLead}</div>
            <p className="text-xs text-muted-foreground">
              Promedio todas las fuentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por Fuente */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Fuente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: source.color }}
                    />
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-gray-600">${source.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={source.roi > 250 ? "default" : "secondary"}>
                      ROI: {source.roi}%
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      Costo: ${source.cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendencia Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ingresos vs Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Ingresos"
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Costos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comisiones y Proyecciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comisiones del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-4">
              ${metrics.commissions.toLocaleString()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Comisiones por ventas</span>
                <span>${(metrics.commissions * 0.8).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonos por objetivos</span>
                <span>${(metrics.commissions * 0.2).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyección Fin de Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              ${metrics.projectedRevenue.toLocaleString()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Meta del mes</span>
                <span>$500,000</span>
              </div>
              <div className="flex justify-between">
                <span>Cumplimiento proyectado</span>
                <Badge variant={metrics.projectedRevenue >= 500000 ? "default" : "secondary"}>
                  {Math.round((metrics.projectedRevenue / 500000) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
