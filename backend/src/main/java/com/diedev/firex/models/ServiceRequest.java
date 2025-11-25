package com.diedev.firex.models;

import com.diedev.firex.enums.ServiceRequestStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "service_requests")
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEstadoExtintor() { return estadoExtintor; }
    public void setEstadoExtintor(String estadoExtintor) { this.estadoExtintor = estadoExtintor; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getFranja() { return franja; }
    public void setFranja(String franja) { this.franja = franja; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public ServiceRequestStatus getStatus() { return status; }
    public void setStatus(ServiceRequestStatus status) { this.status = status; }

    public List<StatusTimeline> getTimeline() { return timeline; }
    public void setTimeline(List<StatusTimeline> timeline) { this.timeline = timeline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}