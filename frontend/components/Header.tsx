'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Flame, Menu, Shield, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  // Componente de navegación que se actualiza con el estado de auth
  const Navigation = () => (
    <>
      <Link 
        href="/" 
        className={`text-sm font-medium hover:text-primary transition-colors relative group ${
          pathname === '/' ? 'text-primary' : ''
        }`}
      >
        Inicio
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
          pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </Link>
      <Link 
        href="/productos" 
        className={`text-sm font-medium hover:text-primary transition-colors relative group ${
          pathname === '/productos' || pathname?.startsWith('/productos/') ? 'text-primary' : ''
        }`}
      >
        Productos
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
          pathname === '/productos' || pathname?.startsWith('/productos/') ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </Link>
      <Link 
        href="/servicios" 
        className={`text-sm font-medium hover:text-primary transition-colors relative group ${
          pathname === '/servicios' ? 'text-primary' : ''
        }`}
      >
        Servicios
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
          pathname === '/servicios' ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
      </Link>
      {/* ✅ CORREGIDO: Solo mostrar una vez el enlace Admin */}
      {isAdmin && (
        <Link 
          href="/admin" 
          className={`text-sm font-medium hover:text-primary transition-colors relative group flex items-center gap-2 ${
            pathname?.startsWith('/admin') ? 'text-primary' : ''
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Panel Admin</span>
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
            pathname?.startsWith('/admin') ? 'w-full' : 'w-0 group-hover:w-full'
          }`} />
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">Fire<span className="gradient-text">X</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Navigation />
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 mt-8">
              <Navigation />
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button variant="ghost" size="icon" className="relative group" asChild>
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="sr-only">Carrito</span>
            </Link>
          </Button>

          {/* User Menu or Login Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="group">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="sr-only">Perfil de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {isAdmin && (
                      <Badge variant="secondary" className="w-fit mt-1 text-xs">
                        Administrador
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mis-solicitudes">
                    <Package className="mr-2 h-4 w-4" />
                    Mis Solicitudes
                  </Link>
                </DropdownMenuItem>
                {/* ✅ Panel admin en el menú desplegable */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="text-primary">
                        <Shield className="mr-2 h-4 w-4" />
                        Panel Administrador
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}