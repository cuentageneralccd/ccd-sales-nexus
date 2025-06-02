
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LogIn, User, Shield, Settings } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';

export const LoginForm = () => {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { username: 'asesor1', role: 'ASESOR', icon: User, color: 'bg-blue-500' },
    { username: 'supervisor1', role: 'SUPERVISOR', icon: Shield, color: 'bg-green-500' },
    { username: 'admin1', role: 'ADMINISTRADOR', icon: Settings, color: 'bg-purple-500' }
  ];

  const loginWithDemo = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CCD Sales Nexus</h1>
          <p className="text-gray-600">Sistema de Gestión de Asesores</p>
        </div>

        {/* Formulario de login */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={isLoading}
                />
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
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDemoUsers(!showDemoUsers)}
              >
                {showDemoUsers ? 'Ocultar' : 'Ver'} usuarios de demostración
              </Button>
            </div>

            {showDemoUsers && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700">Usuarios de demostración:</h4>
                {demoUsers.map((demo) => {
                  const IconComponent = demo.icon;
                  return (
                    <div
                      key={demo.username}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => loginWithDemo(demo.username)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 ${demo.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{demo.username}</p>
                          <Badge variant="outline" className="text-xs">
                            {demo.role}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Contraseña: 123456</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 CCD Sales Nexus. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};
