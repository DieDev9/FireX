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
        console.log('[Auth] Cargando sesión desde localStorage');
        const storedToken = localStorage.getItem('firex_token');
        const storedUser = localStorage.getItem('firex_user');

        if (storedToken && storedUser) {
          // 🛡️ FIX: Si el token es el antiguo "dummy-token", lo descartamos para obligar a re-login
          if (storedToken === 'dummy-token') {
            console.warn('[Auth] Token inválido (dummy-token) detectado. Cerrando sesión para forzar re-autenticación.');
            localStorage.removeItem('firex_token');
            localStorage.removeItem('firex_user');
            return;
          }

          console.log('[Auth] Sesión restaurada exitosamente');
          setToken(storedToken);
          setUserState(JSON.parse(storedUser));
        } else {
          console.log('[Auth] No hay sesión guardada');
        }
      } catch (error) {
        console.error('[Auth] Error loading session:', error);
        localStorage.removeItem('firex_token');
        localStorage.removeItem('firex_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = (userData: UserResponse, jwtToken: string) => {
    console.log('[Auth] Login exitoso para usuario:', userData.email);
    setUserState(userData);
    setToken(jwtToken);
    localStorage.setItem('firex_user', JSON.stringify(userData));
    localStorage.setItem('firex_token', jwtToken);
  };

  const logout = () => {
    console.log('[Auth] Cerrando sesión');
    setUserState(null);
    setToken(null);
    localStorage.removeItem('firex_user');
    localStorage.removeItem('firex_token');
  };

  const setUser = (userData: UserResponse) => {
    console.log('[Auth] Actualizando datos de usuario:', userData.email);
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



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}