'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createServiceRequest } from '@/lib/api-client';
import { ValidatedInput } from '@/components/ValidatedInput';
import { validateServiceRequest, validators } from '@/lib/validators';
import { AlertCircle } from 'lucide-react';

export default function ServiceRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [tipo, setTipo] = useState<"ABC" | "CO2" | "H2O" | "K">("ABC");
  const [estadoExtintor, setEstadoExtintor] = useState<"Operativo" | "Descargado" | "Vencido">("Operativo");
  const [fecha, setFecha] = useState('');
  const [franja, setFranja] = useState<"Mañana" | "Tarde">("Mañana");
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Debes iniciar sesión para crear una solicitud');
      router.push('/login');
      return;
    }

    // ✅ VALIDACIÓN COMPLETA ANTES DE ENVIAR
    const requestData = {
      tipo,
      estadoExtintor,
      fecha,
      franja,
      direccion,
      telefono,
      observaciones: observaciones || undefined,
    };

    const validation = validateServiceRequest(requestData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      
      // Mostrar el primer error
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      
      // Scroll al primer campo con error
      const firstErrorField = Object.keys(validation.errors)[0];
      document.getElementById(firstErrorField)?.focus();
      
      return;
    }

    // Limpiar errores si la validación pasó
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const response = await createServiceRequest(user.id, user.email, requestData);

      if (response.success && response.data) {
        toast.success(`Solicitud ${response.data.requestId} creada exitosamente`);
        
        // Reset form
        setTipo("ABC");
        setEstadoExtintor("Operativo");
        setFecha('');
        setFranja("Mañana");
        setDireccion('');
        setTelefono('');
        setObservaciones('');
        
        // Redirect to my requests
        router.push('/mis-solicitudes');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo crear la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];
  
  // Obtener fecha máxima (3 meses)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Servicio de Recarga</h1>
          <p className="text-muted-foreground">
            Solicita el servicio de recarga y mantenimiento de extintores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Solicitud de Servicio</CardTitle>
            <CardDescription>
              Completa el formulario para programar tu servicio de recarga
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Extintor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Extintor</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Extintor *</Label>
                  <Select value={tipo} onValueChange={(value: "ABC" | "CO2" | "H2O" | "K") => setTipo(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABC">ABC - Polvo Químico Seco</SelectItem>
                      <SelectItem value="CO2">CO2 - Dióxido de Carbono</SelectItem>
                      <SelectItem value="H2O">H2O - Agua</SelectItem>
                      <SelectItem value="K">K - Especial para Cocinas</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.tipo && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.tipo}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estadoExtintor">Estado del Extintor *</Label>
                  <Select value={estadoExtintor} onValueChange={(value: "Operativo" | "Descargado" | "Vencido") => setEstadoExtintor(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operativo">Operativo</SelectItem>
                      <SelectItem value="Descargado">Descargado</SelectItem>
                      <SelectItem value="Vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.estadoExtintor && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.estadoExtintor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Programación del Servicio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Programación del Servicio</h3>
                
                <ValidatedInput
                  id="fecha"
                  label="Fecha Preferida"
                  type="date"
                  value={fecha}
                  onChange={setFecha}
                  validator={validators.date}
                  errorMessage="La fecha debe ser hoy o en el futuro"
                  required
                  min={today}
                  helperText={`Selecciona una fecha entre hoy y ${maxDateStr}`}
                />

                <div className="space-y-2">
                  <Label htmlFor="franja">Franja Horaria *</Label>
                  <Select value={franja} onValueChange={(value: "Mañana" | "Tarde") => setFranja(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mañana">Mañana (9:00 - 13:00)</SelectItem>
                      <SelectItem value="Tarde">Tarde (14:00 - 18:00)</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.franja && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.franja}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información de Contacto</h3>
                
                <ValidatedInput
                  id="telefono"
                  label="Teléfono"
                  type="tel"
                  value={telefono}
                  onChange={setTelefono}
                  validator={validators.phone}
                  errorMessage="Debe ser un celular colombiano válido"
                  placeholder="3001234567"
                  required
                  helperText="Formato: 10 dígitos comenzando con 3"
                  pattern="3[0-9]{9}"
                />

                <ValidatedInput
                  id="direccion"
                  label="Dirección de Servicio"
                  type="textarea"
                  value={direccion}
                  onChange={setDireccion}
                  validator={validators.address}
                  errorMessage="La dirección debe tener al menos 10 caracteres"
                  placeholder="Dirección completa donde se realizará el servicio"
                  required
                  rows={3}
                />
              </div>

              {/* Observaciones */}
              <ValidatedInput
                id="observaciones"
                label="Observaciones"
                type="textarea"
                value={observaciones}
                onChange={setObservaciones}
                placeholder="Información adicional sobre tu solicitud..."
                rows={4}
                helperText="Opcional: Detalles adicionales que desees compartir"
              />

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando solicitud...' : 'Crear Solicitud'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}