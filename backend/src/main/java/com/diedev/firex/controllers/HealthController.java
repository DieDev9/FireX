package com.diedev.firex.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para verificar el estado del servidor
 * Base URL: /api/health
 */
@Slf4j
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * GET /api/health
     * Verificar que el servidor está funcionando
     *
     * @return Estado del servidor
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "FireX Hub API");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }
}