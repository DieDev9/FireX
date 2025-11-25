package com.diedev.firex.service.impl;

import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.models.Notification;
import com.diedev.firex.repositories.NotificationRepository;
import com.diedev.firex.service.interfaces.NotificationService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final com.diedev.firex.repositories.NotificationPreferencesRepository preferencesRepository;
    private final com.diedev.firex.service.interfaces.EmailService emailService;
    private final com.diedev.firex.repositories.UserRepository userRepository; // Necesario para obtener email del usuario

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   com.diedev.firex.repositories.NotificationPreferencesRepository preferencesRepository,
                                   com.diedev.firex.service.interfaces.EmailService emailService,
                                   com.diedev.firex.repositories.UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.preferencesRepository = preferencesRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }
    
    // Map para guardar los emitters activos por usuario
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Override
    @Async // Ejecutar en hilo separado para no bloquear la transacción principal
    public void sendNotification(String userId, Notification notification) {
        log.info("Procesando notificación para usuario {}: {}", userId, notification.getTitle());

        // 1. Obtener preferencias del usuario (o crear default si no existen)
        com.diedev.firex.models.NotificationPreferences prefs = preferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    com.diedev.firex.models.NotificationPreferences newPrefs = new com.diedev.firex.models.NotificationPreferences();
                    newPrefs.setUserId(userId);
                    return preferencesRepository.save(newPrefs);
                });

        // 2. Verificar si la categoría está permitida
        boolean categoryAllowed = isCategoryAllowed(prefs, notification.getType());

        if (!categoryAllowed) {
            log.info("Notificación bloqueada por preferencias de usuario: {}", notification.getType());
            return;
        }

        // 3. Guardar en base de datos (siempre, para historial)
        notification.setUserId(userId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        Notification savedNotification = notificationRepository.save(notification);

        // 4. Enviar Push (SSE) si está habilitado
        if (prefs.getPushEnabled()) {
            SseEmitter emitter = emitters.get(userId);
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("notification")
                            .data(savedNotification));
                    log.debug("Notificación enviada por SSE a {}", userId);
                } catch (IOException e) {
                    log.warn("Error enviando SSE a usuario {}: {}", userId, e.getMessage());
                    emitters.remove(userId); // Remover emitter fallido
                }
            }
        }

        // 5. Enviar Email si está habilitado
        if (prefs.getEmailEnabled()) {
            userRepository.findById(userId).ifPresent(user -> {
                String emailContent = buildEmailContent(notification);
                emailService.sendHtmlEmail(user.getEmail(), notification.getTitle(), emailContent);
                
                // Actualizar estado de envío
                savedNotification.setEmailSent(true);
                notificationRepository.save(savedNotification);
            });
        }
    }

    private boolean isCategoryAllowed(com.diedev.firex.models.NotificationPreferences prefs, com.diedev.firex.enums.NotificationType type) {
        if (type == null) return true;
        
        switch (type.getCategory()) {
            case "orders": return prefs.getOrderNotifications();
            case "services": return prefs.getServiceNotifications();
            case "marketing": return prefs.getMarketingNotifications();
            case "system": return prefs.getSystemNotifications();
            default: return true;
        }
    }

    private String buildEmailContent(Notification notification) {
        // Template simple HTML
        return String.format(
            "<html>" +
            "<body style='font-family: Arial, sans-serif; color: #333;'>" +
            "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;'>" +
            "<h2 style='color: #d32f2f;'>%s</h2>" +
            "<p>%s</p>" +
            "%s" +
            "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'/>" +
            "<p style='font-size: 12px; color: #999;'>FireX - Seguridad Industrial</p>" +
            "</div>" +
            "</body>" +
            "</html>",
            notification.getTitle(),
            notification.getMessage(),
            notification.getActionUrl() != null ? 
                String.format("<a href='%s' style='display: inline-block; background: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Ver Detalles</a>", notification.getActionUrl()) : ""
        );
    }

    @Override
    public SseEmitter subscribe(String userId) {
        log.info("Nueva suscripción SSE para usuario: {}", userId);
        
        // Timeout de 5 minutos (300000 ms) o infinito (0L)
        SseEmitter emitter = new SseEmitter(300000L);
        
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            log.debug("SSE completado para usuario: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            log.debug("SSE timeout para usuario: {}", userId);
            emitter.complete();
            emitters.remove(userId);
        });

        emitter.onError((e) -> {
            log.debug("SSE error para usuario {}: {}", userId, e.getMessage());
            emitter.complete();
            emitters.remove(userId);
        });

        // Enviar evento inicial para confirmar conexión
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Conexión SSE establecida"));
        } catch (IOException e) {
            log.error("Error enviando evento inicial SSE", e);
            emitters.remove(userId);
        }

        return emitter;
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación", "id", notificationId));
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        if (!unread.isEmpty()) {
            unread.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(unread);
            log.info("Marcadas {} notificaciones como leídas para usuario {}", unread.size(), userId);
        }
    }

    @Override
    public void deleteNotification(String notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notificación", "id", notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }

    @Override
    public void deleteAllNotifications(String userId) {
        notificationRepository.deleteByUserId(userId);
        log.info("Eliminadas todas las notificaciones del usuario {}", userId);
    }

    @Override
    public com.diedev.firex.models.NotificationPreferences getPreferences(String userId) {
        return preferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    com.diedev.firex.models.NotificationPreferences newPrefs = new com.diedev.firex.models.NotificationPreferences();
                    newPrefs.setUserId(userId);
                    return preferencesRepository.save(newPrefs);
                });
    }

    @Override
    public com.diedev.firex.models.NotificationPreferences updatePreferences(String userId, com.diedev.firex.models.NotificationPreferences preferences) {
        preferences.setUserId(userId); // Asegurar ID correcto
        preferences.setUpdatedAt(java.time.LocalDateTime.now());
        return preferencesRepository.save(preferences);
    }
    
    // Getter para el controlador (idealmente esto debería estar en la interfaz o un servicio separado)
    public com.diedev.firex.repositories.NotificationPreferencesRepository getPreferencesRepository() {
        return preferencesRepository;
    }
}
