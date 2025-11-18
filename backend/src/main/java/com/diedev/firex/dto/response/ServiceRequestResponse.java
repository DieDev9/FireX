package com.diedev.firex.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestResponse {
    private String id;
    private String requestId;
    private String userId;
    private String userEmail;
    private String tipo;
    private String estadoExtintor;
    private String fecha;
    private String franja;
    private String direccion;
    private String telefono;
    private String observaciones;
    private String status;
    private List<TimelineResponse> timeline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}