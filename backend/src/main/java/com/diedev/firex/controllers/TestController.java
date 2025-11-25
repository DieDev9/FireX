package com.diedev.firex.controllers;

import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.service.interfaces.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final EmailService emailService;
    private final com.diedev.firex.service.interfaces.NotificationService notificationService;

    public TestController(EmailService emailService, com.diedev.firex.service.interfaces.NotificationService notificationService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @GetMapping("/email")
    public ResponseEntity<ApiResponse<String>> sendTestEmail(
            @RequestParam String to,
            @RequestParam(defaultValue = "Prueba de FireX") String subject,
            @RequestParam(defaultValue = "Este es un correo de prueba desde el backend de FireX.") String body) {
        
        // 1. Enviar correo real
        emailService.sendHtmlEmail(to, subject, "<h1>" + subject + "</h1><p>" + body + "</p>");
        
        // 2. Enviar notificación al frontend (SSE)
        // Usamos el email como ID porque parece que el frontend se conecta usando el email
        com.diedev.firex.models.Notification notification = new com.diedev.firex.models.Notification();
        notification.setTitle(subject);
        notification.setMessage(body);
        notification.setType(com.diedev.firex.enums.NotificationType.SYSTEM_ALERT);
        notification.setCreatedAt(java.time.LocalDateTime.now());
        
        notificationService.sendNotification(to, notification);
        
        return ResponseEntity.ok(ApiResponse.success("Correo y notificación enviados a " + to));
    }
}
