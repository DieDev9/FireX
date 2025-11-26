'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Notification, NotificationPreferences } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { NotificationToast } from '@/components/NotificationToast';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    preferences: NotificationPreferences | null;
    isLoading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    updatePreferences: (prefs: NotificationPreferences) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8066';

    // Fetch initial history
    const fetchNotifications = useCallback(async () => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/notifications/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Handle both direct array and ApiResponse wrapper
                if (Array.isArray(data)) {
                    setNotifications(data);
                } else if (data && Array.isArray(data.data)) {
                    setNotifications(data.data);
                } else {
                    setNotifications([]);
                }
            }
        } catch (error) {
            // Error fetching notifications
        }
    }, [user, token, BASE_URL]);

    // Fetch preferences
    const fetchPreferences = useCallback(async () => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/notifications/${user.id}/preferences`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Handle both direct object and ApiResponse wrapper
                if (data.emailEnabled !== undefined) {
                    setPreferences(data);
                } else if (data.data && data.data.emailEnabled !== undefined) {
                    setPreferences(data.data);
                }
            }
        } catch (error) {
            // Error fetching preferences
        }
    }, [user, token, BASE_URL]);

    // SSE Connection
    useEffect(() => {
        if (!user || !token) {
            return;
        }

        const streamUrl = `${BASE_URL}/api/notifications/stream/${user.id}`;

        fetchNotifications();
        fetchPreferences();

        const controller = new AbortController();

        // Usar fetchEventSource para poder enviar headers
        import('@microsoft/fetch-event-source').then(({ fetchEventSource }) => {
            fetchEventSource(streamUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal,
                onopen(response) {
                    if (response.ok) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject();
                    }
                },
                onmessage(event) {
                    // Ignorar mensajes de control o conexión
                    if (event.data === 'ping' || event.data.includes('Conexión SSE establecida')) {
                        return;
                    }

                    try {
                        const newNotification: Notification = JSON.parse(event.data);
                        setNotifications(prev => [newNotification, ...prev]);

                        // Show toast
                        toast({
                            description: (
                                <NotificationToast
                                    title={newNotification.title}
                                    message={newNotification.message}
                                    type={newNotification.type}
                                    priority={newNotification.priority}
                                />
                            ),
                            duration: 5000,
                        });
                    } catch (error) {
                        // Could not parse message as JSON
                    }
                },
                onerror(error) {
                    // SSE error
                },
                onclose() {
                    // SSE connection closed
                }
            }).catch(err => { });
        });

        return () => {
            controller.abort();
        };
    }, [user, token, fetchNotifications, fetchPreferences, toast, BASE_URL]);

    const markAsRead = async (id: string) => {
        if (!user || !token) return;
        try {
            await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            // Error marking as read
        }
    };

    const markAllAsRead = async () => {
        if (!user || !token) return;
        try {
            await fetch(`${BASE_URL}/api/notifications/${user.id}/read-all`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            // Error marking all as read
        }
    };

    const clearAll = async () => {
        if (!user || !token) return;
        try {
            await fetch(`${BASE_URL}/api/notifications/${user.id}/clear`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]);
        } catch (error) {
            // Error clearing notifications
        }
    };

    const updatePreferences = async (prefs: NotificationPreferences) => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${BASE_URL}/api/notifications/${user.id}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(prefs)
            });
            if (res.ok) {
                setPreferences(prefs);
                toast({
                    title: "Preferencias actualizadas",
                    description: "Tus preferencias de notificación han sido guardadas.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron guardar las preferencias.",
                variant: "destructive"
            });
        }
    };

    const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            preferences,
            isLoading,
            markAsRead,
            markAllAsRead,
            clearAll,
            updatePreferences
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
