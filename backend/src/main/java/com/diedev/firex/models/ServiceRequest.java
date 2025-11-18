package com.diedev.firex.models;

import com.diedev.firex.enums.ServiceRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {

    @Id
    private String id;

    private String requestId; // Ej: SR-1234567890

    private String userId;
    private String userEmail;

    private String tipo; // ABC, CO2, H2O, K
    private String estadoExtintor; // Operativo, Descargado, Vencido
    private String fecha; // YYYY-MM-DD
    private String franja; // Mañana, Tarde

    private String direccion;
    private String telefono;
    private String observaciones;

    private ServiceRequestStatus status;

    private List<StatusTimeline> timeline = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}