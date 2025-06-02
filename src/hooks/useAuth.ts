
import { useState, useEffect, createContext, useContext } from 'react';

export type UserRole = 'ASESOR' | 'SUPERVISOR' | 'ADMINISTRADOR';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  department?: string;
  teamId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de demostración
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'asesor1': {
    password: '123456',
    user: {
      id: '1',
      username: 'asesor1',
      email: 'asesor1@ccd.com',
      name: 'María González',
      role: 'ASESOR',
      permissions: ['VIEW_OWN_METRICS', 'MAKE_CALLS', 'UPDATE_LEAD_STATUS', 'VIEW_OWN_LEADS'],
      department: 'Ventas',
      teamId: 'team1'
    }
  },
  'supervisor1': {
    password: '123456',
    user: {
      id: '2',
      username: 'supervisor1',
      email: 'supervisor1@ccd.com',
      name: 'Carlos Rodríguez',
      role: 'SUPERVISOR',
      permissions: [
        'VIEW_TEAM_METRICS', 'VIEW_TEAM_PERFORMANCE', 'ASSIGN_LEADS', 
        'MONITOR_CALLS', 'CREATE_REPORTS', 'MANAGE_TEAM_SCHEDULE',
        'VIEW_QUALITY_REVIEWS', 'APPROVE_BREAKS'
      ],
      department: 'Ventas',
      teamId: 'team1'
    }
  },
  'admin1': {
    password: '123456',
    user: {
      id: '3',
      username: 'admin1',
      email: 'admin1@ccd.com',
      name: 'Ana Martínez',
      role: 'ADMINISTRADOR',
      permissions: [
        'FULL_ACCESS', 'MANAGE_USERS', 'SYSTEM_CONFIG', 'VIEW_ALL_METRICS',
        'MANAGE_CAMPAIGNS', 'FINANCIAL_REPORTS', 'SYSTEM_MONITORING',
        'BACKUP_RESTORE', 'AUDIT_LOGS', 'MANAGE_INTEGRATIONS'
      ],
      department: 'Administración'
    }
  }
};

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('ccd_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar sesión guardada:', error);
        localStorage.removeItem('ccd_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red
    
    const userData = DEMO_USERS[username];
    if (userData && userData.password === password) {
      setUser(userData.user);
      setIsAuthenticated(true);
      localStorage.setItem('ccd_user', JSON.stringify(userData.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ccd_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('FULL_ACCESS') || user.permissions.includes(permission);
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    isRole
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
