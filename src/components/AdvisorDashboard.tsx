
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Phone, Target, Clock, TrendingUp, Award, Calendar } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useAdvisorPerformance } from '@/hooks/useAdvisorPerformance';

export const AdvisorDashboard = () => {
  const { user } = useAuthContext();
  const { advisors } = useAdvisorPerformance();
  
  // Simular datos del asesor actual
  const currentAdvisor = advisors.find(a => a.name === user?.name) || advisors[0];

  const todayGoals = {
    calls: { target: 50, current: currentAdvisor?.callsToday || 0 },
    sales: { target: 5, current: currentAdvisor?.salesToday || 0 },
    talkTime: { target: 240, current: 180 } // minutos
  };

  const achievements = [
    { title: 'Mejor Vendedor del Mes', date: '2024-05-01', type: 'gold' },
    { title: 'Meta de Llamadas Alcanzada', date: '2024-05-15', type: 'silver' },
    { title: '100% de Calidad', date: '2024-05-20', type: 'bronze' }
  ];

  return (
    <div className="space-y-6">
      {/* Header personalizado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">¡Hola, {user?.name}!</h1>
            <p className="text-blue-100">Panel de Asesor - {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <Badge className="bg-white text-blue-800 mb-2">
              {currentAdvisor?.status || 'ACTIVE'}
            </Badge>
            <p className="text-sm">Equipo: {user?.teamId || 'Ventas A'}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Mi Rendimiento</TabsTrigger>
          <TabsTrigger value="goals">Metas del Día</TabsTrigger>
          <TabsTrigger value="calls">Mis Llamadas</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Llamadas Hoy</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAdvisor?.callsToday || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {currentAdvisor?.avgCallDuration || 0}s por llamada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAdvisor?.salesToday || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Conversión: {currentAdvisor?.conversionRate || 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calidad</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAdvisor?.qualityScore || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Objetivo: 85%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Activo</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((480 - (currentAdvisor?.idleTime || 0) / 60))}m
                </div>
                <p className="text-xs text-muted-foreground">
                  de 480m programados
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Llamadas</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ventas</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calidad</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Meta de Llamadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Progreso:</span>
                    <span>{todayGoals.calls.current}/{todayGoals.calls.target}</span>
                  </div>
                  <Progress 
                    value={(todayGoals.calls.current / todayGoals.calls.target) * 100} 
                  />
                  <p className="text-sm text-muted-foreground">
                    {todayGoals.calls.target - todayGoals.calls.current} llamadas restantes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Meta de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Progreso:</span>
                    <span>{todayGoals.sales.current}/{todayGoals.sales.target}</span>
                  </div>
                  <Progress 
                    value={(todayGoals.sales.current / todayGoals.sales.target) * 100} 
                  />
                  <p className="text-sm text-muted-foreground">
                    {todayGoals.sales.target - todayGoals.sales.current} ventas restantes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Tiempo de Conversación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Progreso:</span>
                    <span>{todayGoals.talkTime.current}/{todayGoals.talkTime.target}m</span>
                  </div>
                  <Progress 
                    value={(todayGoals.talkTime.current / todayGoals.talkTime.target) * 100} 
                  />
                  <p className="text-sm text-muted-foreground">
                    {todayGoals.talkTime.target - todayGoals.talkTime.current} minutos restantes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Llamadas del Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((call) => (
                  <div key={call} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={call % 2 === 0 ? "default" : "secondary"}>
                        {call % 2 === 0 ? "Venta" : "Seguimiento"}
                      </Badge>
                      <div>
                        <p className="font-medium">+1 555-{String(call).padStart(3, '0')}-{String(call * 123).slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleTimeString()} - {Math.floor(Math.random() * 300 + 60)}s
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {call % 3 === 0 ? "Completada" : "En progreso"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Mis Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      achievement.type === 'gold' ? 'bg-yellow-100' :
                      achievement.type === 'silver' ? 'bg-gray-100' : 'bg-orange-100'
                    }`}>
                      <Award className={`h-5 w-5 ${
                        achievement.type === 'gold' ? 'text-yellow-600' :
                        achievement.type === 'silver' ? 'text-gray-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Obtenido el {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
