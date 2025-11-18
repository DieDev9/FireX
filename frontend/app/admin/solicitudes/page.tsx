'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Phone, Mail, Wrench, Clock, User } from 'lucide-react';
import { serviceRequests } from '@/lib/api-client';
import type { ServiceRequest } from '@/types/api';

const statusConfig = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  RECOGIDO: { label: 'Recogido', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  EN_RECARGA: { label: 'En Recarga', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  LISTO: { label: 'Listo', color: 'bg-green-100 text-green-800 border-green-300' },
  ENTREGADO: { label: 'Entregado', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  FINALIZADO: { label: 'Finalizado', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export default function AdminServiceRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      toast({
        title: 'Acceso Denegado',
        description: 'No tienes permisos para acceder a esta página',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    loadRequests();
  }, [user, router]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await serviceRequests.getAll();
      
      if (response.success && response.data) {
        // Ordenar por fecha de creación (más reciente primero)
        const sorted = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setRequests(sorted);
        console.log('✅ Solicitudes cargadas:', sorted.length);
      }
    } catch (error) {
      console.error('❌ Error al cargar solicitudes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las solicitudes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    
    try {
      const response = await serviceRequests.updateStatus(requestId, newStatus, user?.email || 'admin');
      
      if (response.success) {
        toast({
          title: '✅ Estado Actualizado',
          description: `Estado cambiado a: ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`,
        });
        
        // Recargar solicitudes para obtener el timeline actualizado
        await loadRequests();
      }
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredRequests =
    filterStatus === 'ALL'
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Solicitudes de Servicio</h1>
        <p className="text-muted-foreground">
          Gestiona las solicitudes de recarga de extintores ({requests.length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              Todos ({requests.length})
            </SelectItem>
            <SelectItem value="PENDIENTE">
              Pendientes ({requests.filter(r => r.status === 'PENDIENTE').length})
            </SelectItem>
            <SelectItem value="RECOGIDO">
              Recogidos ({requests.filter(r => r.status === 'RECOGIDO').length})
            </SelectItem>
            <SelectItem value="EN_RECARGA">
              En Recarga ({requests.filter(r => r.status === 'EN_RECARGA').length})
            </SelectItem>
            <SelectItem value="LISTO">
              Listos ({requests.filter(r => r.status === 'LISTO').length})
            </SelectItem>
            <SelectItem value="ENTREGADO">
              Entregados ({requests.filter(r => r.status === 'ENTREGADO').length})
            </SelectItem>
            <SelectItem value="FINALIZADO">
              Finalizados ({requests.filter(r => r.status === 'FINALIZADO').length})
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={loadRequests} variant="outline">
          🔄 Actualizar
        </Button>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Solicitud #{request.requestId}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Creada: {new Date(request.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <Badge className={`${statusConfig[request.status as keyof typeof statusConfig].color} border`}>
                  {statusConfig[request.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Información del Servicio */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Detalles del Servicio
                  </h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{request.tipo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado Extintor:</span>
                      <span className="font-medium">{request.estadoExtintor || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">{request.fecha || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Franja:</span>
                      <span className="font-medium">{request.franja || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Información de Contacto
                  </h4>
                  <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="font-medium break-all">{request.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Teléfono</p>
                        <p className="font-medium">{request.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-muted-foreground text-xs">Dirección</p>
                        <p className="font-medium">{request.direccion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {request.observaciones && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">📝 Observaciones</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {request.observaciones}
                  </p>
                </div>
              )}

              {/* Cambiar Estado */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <label className="text-sm font-medium">Cambiar Estado:</label>
                <Select
                  value={request.status}
                  onValueChange={(value) => handleStatusChange(request.id, value)}
                  disabled={updatingStatus === request.id}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="RECOGIDO">Recogido</SelectItem>
                    <SelectItem value="EN_RECARGA">En Recarga</SelectItem>
                    <SelectItem value="LISTO">Listo</SelectItem>
                    <SelectItem value="ENTREGADO">Entregado</SelectItem>
                    <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                {updatingStatus === request.id && (
                  <span className="text-sm text-muted-foreground">Actualizando...</span>
                )}
              </div>

              {/* Timeline */}
              {request.timeline && request.timeline.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Historial de Estados
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {request.timeline.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <span className="font-medium">
                            {statusConfig[item.status]?.label || item.status}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(item.timestamp).toLocaleString('es-ES')}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Por: {item.by}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filterStatus === 'ALL' 
                  ? 'No hay solicitudes registradas' 
                  : `No hay solicitudes con estado "${statusConfig[filterStatus as keyof typeof statusConfig]?.label}"`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}