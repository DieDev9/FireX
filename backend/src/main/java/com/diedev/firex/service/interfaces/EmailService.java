package com.diedev.firex.service.interfaces;

public interface EmailService {
    
    /**
     * Enviar correo electrónico simple
     */
    void sendEmail(String to, String subject, String content);
    
    /**
     * Enviar correo electrónico HTML
     */
    void sendHtmlEmail(String to, String subject, String htmlContent);
}
