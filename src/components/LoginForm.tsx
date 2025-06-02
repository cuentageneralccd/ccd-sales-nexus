
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username.trim(), password);
      
      if (success) {
        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión exitosamente",
        });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { username: 'asesor1', role: 'ASESOR', description: 'Ver panel de asesor individual' },
    { username: 'supervisor1', role: 'SUPERVISOR', description: 'Monitor de equipo y gestión' },
    { username: 'admin1', role: 'ADMINISTRADOR', description: 'Control total del sistema' }
  ];

  const fillDemoCredentials = (username: string) => {
    setUsername(username);
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CCD Sales Nexus</h1>
          <p className="text-gray-600">Sistema Integrado de Gestión</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Usuarios demo */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Usuarios de demostración
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => fillDemoCredentials(user.username)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            user.role === 'ADMINISTRADOR' ? 'default' :
                            user.role === 'SUPERVISOR' ? 'secondary' : 'outline'
                          }
                        >
                          {user.role}
                        </Badge>
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Clic para usar
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-center text-gray-500">
                Contraseña para todos: <span className="font-mono bg-gray-100 px-1 rounded">123456</span>
              </div>
            </div>

            {/* Información adicional */}
            <div className="text-center text-xs text-gray-500">
              <p>Sistema integrado con Vicidial</p>
              <p>Monitoreo en tiempo real • KPIs avanzados • Gestión completa de leads</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 CCD Sales Nexus. Todos los derechos reservados.</p>
          <p>v2.1.0 - Sistema Profesional de Call Center</p>
        </div>
      </div>
    </div>
  );
};
