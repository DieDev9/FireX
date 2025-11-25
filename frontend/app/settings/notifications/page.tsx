'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { NotificationPreferences } from '@/types/notification';

export default function NotificationSettingsPage() {
    const { preferences, updatePreferences, isLoading } = useNotifications();
    const [localPrefs, setLocalPrefs] = useState<NotificationPreferences | null>(preferences);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (preferences) {
            setLocalPrefs(preferences);
        }
    }, [preferences]);

    const handleToggle = (key: keyof NotificationPreferences) => {
        if (!localPrefs) return;
        setLocalPrefs({
            ...localPrefs,
            [key]: !localPrefs[key]
        });
    };

    const handleSave = async () => {
        if (!localPrefs) return;
        setIsSaving(true);
        await updatePreferences(localPrefs);
        setIsSaving(false);
    };

    if (!localPrefs && isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!localPrefs) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No se pudieron cargar las preferencias.
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                    <CardDescription>
                        Gestiona cómo y cuándo quieres recibir notificaciones.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Canales</h3>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                <span>Notificaciones por Email</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Recibe actualizaciones importantes en tu correo electrónico.
                                </span>
                            </Label>
                            <Switch
                                id="email-notifications"
                                checked={localPrefs.emailEnabled}
                                onCheckedChange={() => handleToggle('emailEnabled')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                                <span>Notificaciones Push</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Recibe notificaciones en tiempo real en tu navegador.
                                </span>
                            </Label>
                            <Switch
                                id="push-notifications"
                                checked={localPrefs.pushEnabled}
                                onCheckedChange={() => handleToggle('pushEnabled')}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tipos de Notificación</h3>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="order-notifications" className="flex flex-col space-y-1">
                                <span>Pedidos</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Actualizaciones sobre el estado de tus compras.
                                </span>
                            </Label>
                            <Switch
                                id="order-notifications"
                                checked={localPrefs.orderNotifications}
                                onCheckedChange={() => handleToggle('orderNotifications')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="service-notifications" className="flex flex-col space-y-1">
                                <span>Servicios</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Recordatorios y actualizaciones de mantenimiento de extintores.
                                </span>
                            </Label>
                            <Switch
                                id="service-notifications"
                                checked={localPrefs.serviceNotifications}
                                onCheckedChange={() => handleToggle('serviceNotifications')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="promo-notifications" className="flex flex-col space-y-1">
                                <span>Promociones</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Ofertas especiales y novedades.
                                </span>
                            </Label>
                            <Switch
                                id="promo-notifications"
                                checked={localPrefs.promotionalNotifications}
                                onCheckedChange={() => handleToggle('promotionalNotifications')}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => {
                            // Simulación visual para pruebas
                            const { toast } = require('@/hooks/use-toast');
                            const { NotificationToast } = require('@/components/NotificationToast');

                            toast({
                                description: (
                                    <NotificationToast
                                        title="Prueba de Notificación"
                                        message="Esta es una notificación de prueba simulada para verificar el diseño."
                                        type="INFO"
                                        priority="MEDIUM"
                                    />
                                ),
                                duration: 5000,
                            });
                        }}>
                            Simular Notificación (Test)
                        </Button>

                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
