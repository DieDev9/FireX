'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { getMyServiceRequests } from '@/lib/api-client';
import type { ServiceRequest } from '@/types/api';

const statusConfig = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  RECOGIDO: { label: 'Recogido', color: 'bg-blue-100 text-blue-800' },
  EN_RECARGA: { label: 'En Recarga', color: 'bg-purple-100 text-purple-800' },
  LISTO: { label: 'Listo', color: 'bg-green-100 text-green-800' },
  ENTREGADO: { label: 'Entregado', color: 'bg-teal-100 text-teal-800' },
  FINALIZADO: { label: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
};

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    if (user) {
      loadRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      const response = await getMyServiceRequests(user.email);
      if (response.success && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      toast.error('No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Inicia sesión</h2>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para ver tus solicitudes
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mis Solicitudes</h1>
            <p className="text-muted-foreground">
              Historial de servicios de recarga
            </p>
          </div>
          <Button asChild>
            <Link href="/servicios">Nueva Solicitud</Link>
          </Button>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No tienes solicitudes registradas
              </p>
              <Button asChild>
                <Link href="/servicios">Crear Solicitud</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Solicitud #{request.requestId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Creada: {new Date(request.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Badge className={statusConfig[request.status].color}>
                      {statusConfig[request.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Extintor</p>
                      <p className="font-medium">{request.extinguisherType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacidad</p>
                      <p className="font-medium">{request.capacity}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequest(request)}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud #{selectedRequest?.requestId}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Estado Actual</h3>
                <Badge className={`${statusConfig[selectedRequest.status].color} text-base px-3 py-1`}>
                  {statusConfig[selectedRequest.status].label}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Información del Extintor</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{selectedRequest.extinguisherType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacidad:</span>
                    <p className="font-medium">{selectedRequest.capacity}</p>
                  </div>
                  {selectedRequest.serialNumber && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Nº Serie:</span>
                      <p className="font-medium">{selectedRequest.serialNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Información de Contacto</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedRequest.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dirección:</span>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                  {selectedRequest.preferredDate && (
                    <div>
                      <span className="text-muted-foreground">Fecha Preferida:</span>
                      <p className="font-medium">
                        {new Date(selectedRequest.preferredDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.additionalNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Notas Adicionales</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.additionalNotes}
                  </p>
                </div>
              )}

              {selectedRequest.timeline && selectedRequest.timeline.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Historial de Estados</h3>
                  <div className="space-y-3">
                    {selectedRequest.timeline.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                          {index < selectedRequest.timeline.length - 1 && (
                            <div className="flex-1 w-0.5 bg-border min-h-[24px]" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm">
                            {statusConfig[item.status]?.label || item.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString('es-ES')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Por: {item.updatedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
