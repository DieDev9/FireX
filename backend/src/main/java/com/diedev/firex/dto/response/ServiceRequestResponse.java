package com.diedev.firex.dto.response;


import java.time.LocalDateTime;
import java.util.List;

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

    public ServiceRequestResponse() {}

    public ServiceRequestResponse(String id, String requestId, String userId, String userEmail, String tipo, String estadoExtintor, String fecha, String franja, String direccion, String telefono, String observaciones, String status, List<TimelineResponse> timeline, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.requestId = requestId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.tipo = tipo;
        this.estadoExtintor = estadoExtintor;
        this.fecha = fecha;
        this.franja = franja;
        this.direccion = direccion;
        this.telefono = telefono;
        this.observaciones = observaciones;
        this.status = status;
        this.timeline = timeline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ServiceRequestResponseBuilder builder() {
        return new ServiceRequestResponseBuilder();
    }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<TimelineResponse> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineResponse> timeline) { this.timeline = timeline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class ServiceRequestResponseBuilder {
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

        ServiceRequestResponseBuilder() {}

        public ServiceRequestResponseBuilder id(String id) { this.id = id; return this; }
        public ServiceRequestResponseBuilder requestId(String requestId) { this.requestId = requestId; return this; }
        public ServiceRequestResponseBuilder userId(String userId) { this.userId = userId; return this; }
        public ServiceRequestResponseBuilder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public ServiceRequestResponseBuilder tipo(String tipo) { this.tipo = tipo; return this; }
        public ServiceRequestResponseBuilder estadoExtintor(String estadoExtintor) { this.estadoExtintor = estadoExtintor; return this; }
        public ServiceRequestResponseBuilder fecha(String fecha) { this.fecha = fecha; return this; }
        public ServiceRequestResponseBuilder franja(String franja) { this.franja = franja; return this; }
        public ServiceRequestResponseBuilder direccion(String direccion) { this.direccion = direccion; return this; }
        public ServiceRequestResponseBuilder telefono(String telefono) { this.telefono = telefono; return this; }
        public ServiceRequestResponseBuilder observaciones(String observaciones) { this.observaciones = observaciones; return this; }
        public ServiceRequestResponseBuilder status(String status) { this.status = status; return this; }
        public ServiceRequestResponseBuilder timeline(List<TimelineResponse> timeline) { this.timeline = timeline; return this; }
        public ServiceRequestResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ServiceRequestResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ServiceRequestResponse build() {
            return new ServiceRequestResponse(id, requestId, userId, userEmail, tipo, estadoExtintor, fecha, franja, direccion, telefono, observaciones, status, timeline, createdAt, updatedAt);
        }
    }
}