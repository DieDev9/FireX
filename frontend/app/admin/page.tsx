'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Wrench, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { products, users, serviceRequests } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingRequests: 0,
    totalUsers: 0,
    loading: true,
    requestStats: [] as { name: string; value: number }[],
    lowStockProducts: [] as { name: string; stock: number }[],
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      toast({
        title: 'Acceso Denegado',
        description: 'No tienes permisos para acceder al panel de administración',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      // Cargar productos
      const productsRes = await products.getAll();
      const allProducts = productsRes.data || [];
      const totalProducts = allProducts.length;

      // Productos con stock bajo (< 10)
      const lowStock = allProducts.filter(p => p.stock > 0 && p.stock < 10).length;

      // Cargar usuarios
      const usersRes = await users.getAll();
      const totalUsers = usersRes.data?.length || 0;

      // Cargar todas las solicitudes para el gráfico
      const allRequestsRes = await serviceRequests.getAll();
      const allRequests = allRequestsRes.data || [];

      const statusCounts = allRequests.reduce((acc, req) => {
        const status = req.status || 'PENDIENTE';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const requestStats = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      const pendingRequests = statusCounts['PENDIENTE'] || 0;

      // Top 5 productos con menos stock
      const lowStockProducts = allProducts
        .filter(p => p.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map(p => ({
          name: p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''),
          stock: p.stock,
        }));

      setStats({
        totalProducts,
        lowStock,
        pendingRequests,
        totalUsers,
        loading: false,
        requestStats,
        lowStockProducts,
      });

      console.log('✅ Estadísticas cargadas:', {
        totalProducts,
        lowStock,
        pendingRequests,
        totalUsers,
      });
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive',
      });
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (!user || stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Gestión de Productos',
      description: 'Crear, editar y eliminar productos del catálogo',
      icon: Package,
      href: '/admin/productos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Solicitudes de Servicio',
      description: 'Gestionar recargas y mantenimientos',
      icon: Wrench,
      href: '/admin/solicitudes',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : undefined,
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar cuentas de clientes',
      icon: Users,
      href: '/admin/usuarios',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Categorías',
      description: 'Organizar productos por categorías',
      icon: TrendingUp,
      href: '/admin/categorias',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.name}. Gestiona tu tienda FireX desde aquí.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Productos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Productos en catálogo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stock Bajo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.lowStock}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Productos con menos de 10 unidades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solicitudes Pendientes
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Esperando procesamiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>


        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Solicitudes</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.requestStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.requestStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos con Menor Stock</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.lowStockProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#ff8042" name="Stock" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    {card.badge && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                  <Button variant="outline" className="mt-4 w-full">
                    Abrir
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        {stats.lowStock > 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-900">
                    ⚠️ Atención: {stats.lowStock} productos con stock bajo
                  </p>
                  <p className="text-sm text-orange-700">
                    Revisa el inventario para evitar quedarte sin productos
                  </p>
                </div>
                <Button asChild variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-100">
                  <Link href="/admin/productos">
                    Ver Productos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div >
  );
}