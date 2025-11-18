package com.diedev.firex.models;

import com.diedev.firex.enums.ServiceRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusTimeline {

    private LocalDateTime timestamp;
    private ServiceRequestStatus status;
    private String by; // Usuario que realizó el cambio
}