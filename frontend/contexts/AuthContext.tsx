'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserResponse } from '@/types/api';

type AuthContextType = {
  user: UserResponse | null;
  token: string | null;
  login: (user: UserResponse, token: string) => void;
  logout: () => void;
  setUser: (user: UserResponse) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    const loadSession = () => {
      try {
        console.log('🔄 Intentando cargar sesión...');
        
        const storedToken = localStorage.getItem('firex_token');
        const storedUser = localStorage.getItem('firex_user');
        
        console.log('📦 LocalStorage:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          tokenLength: storedToken?.length || 0
        });
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUserState(parsedUser);
          console.log('✅ Sesión restaurada exitosamente:', {
            email: parsedUser.email,
            role: parsedUser.role,
            id: parsedUser.id
          });
        } else {
          console.log('ℹ️ No hay sesión guardada');
        }
      } catch (error) {
        console.error('❌ Error al cargar sesión:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('firex_token');
        localStorage.removeItem('firex_user');
      } finally {
        setIsLoading(false);
        console.log('✓ Carga de sesión completada');
      }
    };

    // Ejecutar inmediatamente
    loadSession();
  }, []);

  const login = (userData: UserResponse, jwtToken: string) => {
    console.log('🔐 Ejecutando login en contexto:', {
      email: userData.email,
      role: userData.role,
      token: jwtToken ? '✓ Token presente' : '✗ Sin token'
    });
    
    try {
      // Actualizar estado
      setUserState(userData);
      setToken(jwtToken);
      
      // Guardar en localStorage
      localStorage.setItem('firex_user', JSON.stringify(userData));
      localStorage.setItem('firex_token', jwtToken);
      
      // Verificar que se guardó
      const saved = localStorage.getItem('firex_user');
      console.log('✅ Datos guardados en localStorage:', !!saved);
      
    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión');
    setUserState(null);
    setToken(null);
    localStorage.removeItem('firex_user');
    localStorage.removeItem('firex_token');
    console.log('✓ Sesión cerrada');
  };

  const setUser = (userData: UserResponse) => {
    console.log('👤 Actualizando usuario:', userData.email);
    setUserState(userData);
    localStorage.setItem('firex_user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    login,
    logout,
    setUser,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN',
  };

  // ✅ Mostrar loading mientras se carga la sesión
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('📊 Estado actual del auth:', {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN'
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}