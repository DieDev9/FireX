package com.diedev.firex.service.interfaces;

import com.diedev.firex.models.Notification;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {

    /**
     * Crear y enviar una notificación a un usuario
     */
    void sendNotification(String userId, Notification notification);

    /**
     * Suscribirse a notificaciones en tiempo real (SSE)
     */
    SseEmitter subscribe(String userId);

    /**
     * Obtener todas las notificaciones de un usuario
     */
    List<Notification> getUserNotifications(String userId);

    /**
     * Obtener notificaciones no leídas de un usuario
     */
    List<Notification> getUnreadNotifications(String userId);

    /**
     * Marcar una notificación como leída
     */
    void markAsRead(String notificationId);

    /**
     * Marcar todas las notificaciones como leídas
     */
    void markAllAsRead(String userId);

    /**
     * Eliminar una notificación
     */
    void deleteNotification(String notificationId);

    /**
     * Eliminar todas las notificaciones de un usuario
     */
    void deleteAllNotifications(String userId);
    /**
     * Obtener preferencias de notificación de un usuario
     */
    com.diedev.firex.models.NotificationPreferences getPreferences(String userId);

    /**
     * Actualizar preferencias de notificación de un usuario
     */
    com.diedev.firex.models.NotificationPreferences updatePreferences(String userId, com.diedev.firex.models.NotificationPreferences preferences);
}
