
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Shield, Settings } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { AdvisorDashboard } from './AdvisorDashboard';
import { SupervisorDashboard } from './SupervisorDashboard';
import { AdministratorDashboard } from './AdministratorDashboard';

export const AuthenticatedApp = () => {
  const { user, logout } = useAuthContext();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'ASESOR': return <User className="h-4 w-4" />;
      case 'SUPERVISOR': return <Shield className="h-4 w-4" />;
      case 'ADMINISTRADOR': return <Settings className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'ASESOR': return 'bg-blue-100 text-blue-800';
      case 'SUPERVISOR': return 'bg-green-100 text-green-800';
      case 'ADMINISTRADOR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ASESOR':
        return <AdvisorDashboard />;
      case 'SUPERVISOR':
        return <SupervisorDashboard />;
      case 'ADMINISTRADOR':
        return <AdministratorDashboard />;
      default:
        return <AdvisorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">CCD Sales Nexus</h1>
              <Badge variant="outline">Sistema Integrado</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon()}
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Badge className={`text-xs ${getRoleColor()}`}>
                    {user?.role}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderDashboard()}
      </div>
    </div>
  );
};
