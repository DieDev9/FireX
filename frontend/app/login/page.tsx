'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { login as apiLogin } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { ValidatedInput } from '@/components/ValidatedInput';
import { validateLoginForm, validateRegisterForm, validators } from '@/lib/validators';
import type { RegisterRequest, ApiResponse, UserResponse } from '@/types/api';

// Helper para hacer llamadas directas
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8066';
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: `HTTP error! status: ${response.status}` 
    }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  
  return response.json();
}

function LoginContent() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ VALIDAR ANTES DE ENVIAR
    const validation = validateLoginForm(loginEmail, loginPassword);
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toast({
        title: 'Error de validación',
        description: firstError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      console.log('🔐 Intentando login con:', loginEmail);
      const response = await apiLogin(loginEmail, loginPassword);
      
      console.log('📦 Respuesta del servidor:', response);
      
      if (!response.user) {
        throw new Error('No se recibió información del usuario');
      }

      const token = response.token || (response as any).data?.token || 'dummy-token';
      
      console.log('✅ Login exitoso:', {
        user: response.user.email,
        role: response.user.role,
        token: token ? '✓ Token recibido' : '✗ Sin token'
      });
      
      authLogin(response.user, token);
      
      toast({
        title: 'Bienvenido',
        description: `Hola ${response.user.name}!`,
      });
      
      setTimeout(() => {
        router.push('/');
      }, 100);
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      toast({
        title: 'Error al iniciar sesión',
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ VALIDAR ANTES DE ENVIAR
    const registerData: RegisterRequest = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
      address: registerAddress,
    };

    const validation = validateRegisterForm(registerData);

    if (!validation.isValid) {
      setIsRegistering(false);
      
      // Mostrar todos los errores
      Object.entries(validation.errors).forEach(([field, error]) => {
        toast({
          title: `Error en ${field}`,
          description: error,
          variant: 'destructive',
        });
      });
      return;
    }

    setIsRegistering(true);

    try {
      console.log('📝 Registrando usuario:', {
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        address: registerAddress
      });

      const response = await apiCall<ApiResponse<UserResponse>>('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });

      console.log('✅ Registro exitoso:', response);

      if (response.success && response.data) {
        toast({
          title: 'Registro exitoso',
          description: 'Ahora puedes iniciar sesión',
        });
        
        // Cambiar a la pestaña de login y pre-llenar el email
        const loginTab = document.querySelector('[value="login"]') as HTMLElement;
        loginTab?.click();
        setLoginEmail(registerEmail);
        
        // Limpiar campos de registro
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterPhone('');
        setRegisterAddress('');
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      toast({
        title: 'Error al registrarse',
        description: error instanceof Error ? error.message : 'No se pudo completar el registro',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Bienvenido a FireX</CardTitle>
            <CardDescription>
              Inicia sesión o crea una cuenta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <ValidatedInput
                    id="login-email"
                    label="Email"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    validator={validators.email}
                    errorMessage="Email inválido"
                    placeholder="tu@email.com"
                    required
                  />

                  <ValidatedInput
                    id="login-password"
                    label="Contraseña"
                    type="password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    validator={validators.required}
                    errorMessage="La contraseña es requerida"
                    required
                    showValidIcon={false}
                  />

                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <ValidatedInput
                    id="register-name"
                    label="Nombre Completo"
                    type="text"
                    value={registerName}
                    onChange={setRegisterName}
                    validator={validators.name}
                    errorMessage="Nombre inválido (mínimo 3 letras)"
                    placeholder="Alejandro Santamaria"
                    required
                  />
                  
                  <ValidatedInput
                    id="register-email"
                    label="Email"
                    type="email"
                    value={registerEmail}
                    onChange={setRegisterEmail}
                    validator={validators.email}
                    errorMessage="Email inválido"
                    placeholder="alejandro@correo.uis.edu.co"
                    required
                  />
                  
                  <ValidatedInput
                    id="register-password"
                    label="Contraseña"
                    type="password"
                    value={registerPassword}
                    onChange={setRegisterPassword}
                    validator={validators.password}
                    errorMessage="Mínimo 6 caracteres"
                    placeholder="Mínimo 6 caracteres"
                    required
                    helperText="Tu contraseña debe tener al menos 6 caracteres"
                    showValidIcon={false}
                  />
                  
                  <ValidatedInput
                    id="register-phone"
                    label="Teléfono"
                    type="tel"
                    value={registerPhone}
                    onChange={setRegisterPhone}
                    validator={validators.phone}
                    errorMessage="Teléfono inválido (ej: 3001234567)"
                    placeholder="3001234567"
                    required
                    helperText="Debe ser un celular colombiano de 10 dígitos"
                    pattern="3[0-9]{9}"
                  />
                  
                  <ValidatedInput
                    id="register-address"
                    label="Dirección"
                    type="text"
                    value={registerAddress}
                    onChange={setRegisterAddress}
                    validator={validators.address}
                    errorMessage="Dirección muy corta (mínimo 10 caracteres)"
                    placeholder="Calle 123 #45-67, Bucaramanga"
                    required
                  />
                  
                  <Button type="submit" className="w-full" disabled={isRegistering}>
                    {isRegistering ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Al continuar, aceptas nuestros{' '}
              <Link href="#" className="text-primary hover:underline">
                términos y condiciones
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}