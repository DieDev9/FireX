package com.diedev.firex.controllers;

import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.models.Notification;
import com.diedev.firex.service.interfaces.NotificationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * GET /api/notifications/stream/{userId}
     * Endpoint SSE para recibir notificaciones en tiempo real
     */
    @GetMapping(value = "/stream/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@PathVariable String userId) {
        log.info("Cliente conectado a stream de notificaciones: {}", userId);
        return notificationService.subscribe(userId);
    }

    /**
     * GET /api/notifications/{userId}
     * Obtener historial de notificaciones
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/{userId}/unread
     * Obtener solo notificaciones no leídas
     */
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * PUT /api/notifications/{id}/read
     * Marcar una notificación como leída
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notificación marcada como leída"));
    }

    /**
     * PUT /api/notifications/{userId}/read-all
     * Marcar todas las notificaciones como leídas
     */
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("Todas las notificaciones marcadas como leídas"));
    }

    /**
     * DELETE /api/notifications/{id}
     * Eliminar una notificación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notificación eliminada"));
    }

    /**
     * GET /api/notifications/{userId}/preferences
     * Obtener preferencias de notificación
     */
    @GetMapping("/{userId}/preferences")
    public ResponseEntity<ApiResponse<com.diedev.firex.models.NotificationPreferences>> getPreferences(@PathVariable String userId) {
        com.diedev.firex.models.NotificationPreferences prefs = notificationService.getPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success("Preferencias obtenidas", prefs));
    }

    /**
     * PUT /api/notifications/{userId}/preferences
     * Actualizar preferencias de notificación
     */
    @PutMapping("/{userId}/preferences")
    public ResponseEntity<ApiResponse<com.diedev.firex.models.NotificationPreferences>> updatePreferences(
            @PathVariable String userId,
            @RequestBody com.diedev.firex.models.NotificationPreferences preferences) {
            
        com.diedev.firex.models.NotificationPreferences updated = notificationService.updatePreferences(userId, preferences);
        return ResponseEntity.ok(ApiResponse.success("Preferencias actualizadas", updated));
    }

    /**
     * DELETE /api/notifications/{userId}/clear
     * Limpiar todas las notificaciones del usuario
     */
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<ApiResponse<Void>> clearNotifications(@PathVariable String userId) {
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Historial de notificaciones limpiado"));
    }
}
