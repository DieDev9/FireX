package com.diedev.firex.models;

import com.diedev.firex.enums.ServiceRequestStatus;

import java.time.LocalDateTime;

public class StatusTimeline {

    private LocalDateTime timestamp;
    private ServiceRequestStatus status;
    private String by; // Usuario que realizó el cambio

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public ServiceRequestStatus getStatus() { return status; }
    public void setStatus(ServiceRequestStatus status) { this.status = status; }

    public String getBy() { return by; }
    public void setBy(String by) { this.by = by; }
}