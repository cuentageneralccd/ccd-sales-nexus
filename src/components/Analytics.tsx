
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Phone, Clock, Target, DollarSign } from "lucide-react";

export const Analytics = () => {
  // Datos simulados para los gráficos
  const callsData = [
    { hour: '08:00', calls: 45, success: 12 },
    { hour: '09:00', calls: 78, success: 23 },
    { hour: '10:00', calls: 92, success: 28 },
    { hour: '11:00', calls: 105, success: 35 },
    { hour: '12:00', calls: 67, success: 20 },
    { hour: '13:00', calls: 43, success: 13 },
    { hour: '14:00', calls: 89, success: 31 },
    { hour: '15:00', calls: 95, success: 29 },
    { hour: '16:00', calls: 87, success: 26 },
    { hour: '17:00', calls: 71, success: 22 },
  ];

  const conversionData = [
    { day: 'Lun', rate: 18.5 },
    { day: 'Mar', rate: 22.1 },
    { day: 'Mié', rate: 19.8 },
    { day: 'Jue', rate: 25.3 },
    { day: 'Vie', rate: 23.7 },
    { day: 'Sáb', rate: 16.2 },
    { day: 'Dom', rate: 14.8 },
  ];

  const dispositionData = [
    { name: 'Venta', value: 35, color: '#10B981' },
    { name: 'Callback', value: 25, color: '#F59E0B' },
    { name: 'No Interesado', value: 20, color: '#EF4444' },
    { name: 'No Contesta', value: 15, color: '#6B7280' },
    { name: 'Ocupado', value: 5, color: '#8B5CF6' },
  ];

  const agentPerformance = [
    { agent: 'María G.', calls: 145, sales: 28, rate: 19.3 },
    { agent: 'Juan P.', calls: 132, sales: 31, rate: 23.5 },
    { agent: 'Carlos L.', calls: 128, sales: 22, rate: 17.2 },
    { agent: 'Ana M.', calls: 156, sales: 38, rate: 24.4 },
    { agent: 'Roberto S.', calls: 119, sales: 19, rate: 16.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics y Reportes</h2>
        <div className="flex space-x-4">
          <Select defaultValue="today">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Campañas</SelectItem>
              <SelectItem value="camp1">Prospección Q2</SelectItem>
              <SelectItem value="camp2">Seguimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Llamadas</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.1%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% vs semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:24</div>
            <p className="text-xs text-muted-foreground">
              -15s optimización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">
              +8.1% vs mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Llamadas por Hora */}
        <Card>
          <CardHeader>
            <CardTitle>Volumen de Llamadas por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3B82F6" name="Total Llamadas" />
                <Bar dataKey="success" fill="#10B981" name="Exitosas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasa de Conversión */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Conversión Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Tasa de Conversión']} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Disposiciones */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Disposiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dispositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance de Agentes */}
        <Card>
          <CardHeader>
            <CardTitle>Performance de Agentes (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={agent.agent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{agent.agent}</p>
                      <p className="text-sm text-gray-600">{agent.calls} llamadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{agent.sales} ventas</p>
                    <p className="text-sm text-gray-600">{agent.rate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
