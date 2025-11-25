package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.ServiceRequestRequest;
import com.diedev.firex.dto.request.UpdateStatusRequest;
import com.diedev.firex.dto.response.ServiceRequestResponse;
import com.diedev.firex.dto.response.TimelineResponse;
import com.diedev.firex.enums.ServiceRequestStatus;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.models.ServiceRequest;
import com.diedev.firex.models.StatusTimeline;
import com.diedev.firex.repositories.ServiceRequestRepository;
import com.diedev.firex.service.interfaces.IServiceRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de solicitudes de recarga
 * Agregados validaciones de negocio que faltaban
 */
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ServiceRequestServiceImpl implements IServiceRequestService {

    private static final Logger log = LoggerFactory.getLogger(ServiceRequestServiceImpl.class);

    private final ServiceRequestRepository serviceRequestRepository;
    private final com.diedev.firex.service.interfaces.NotificationService notificationService;
    private final com.diedev.firex.service.interfaces.EmailService emailService;

    public ServiceRequestServiceImpl(ServiceRequestRepository serviceRequestRepository,
                                     com.diedev.firex.service.interfaces.NotificationService notificationService,
                                     com.diedev.firex.service.interfaces.EmailService emailService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    @Transactional
    public ServiceRequestResponse createRequest(String userId, String userEmail, ServiceRequestRequest request, String emailHtml) {
        log.info("Creando solicitud de servicio para: {}", userEmail);

        // Validación: Fecha no puede ser en el pasado
        validateFutureDate(request.getFecha());

        // Validación: Teléfono colombiano válido
        validateColombianPhone(request.getTelefono());

        // Validación: No permitir solicitudes duplicadas del mismo usuario en la misma fecha
        validateNoDuplicateRequest(userEmail, request.getFecha());

        // Generar requestId único con timestamp
        String requestId = "SR-" + System.currentTimeMillis();

        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setRequestId(requestId);
        serviceRequest.setUserId(userId);
        serviceRequest.setUserEmail(userEmail);
        serviceRequest.setTipo(request.getTipo());
        serviceRequest.setEstadoExtintor(request.getEstadoExtintor());
        serviceRequest.setFecha(request.getFecha());
        serviceRequest.setFranja(request.getFranja());
        serviceRequest.setDireccion(request.getDireccion().trim());
        serviceRequest.setTelefono(request.getTelefono().trim());
        serviceRequest.setObservaciones(request.getObservaciones() != null ?
                request.getObservaciones().trim() : null);
        serviceRequest.setStatus(ServiceRequestStatus.PENDIENTE);
        serviceRequest.setCreatedAt(LocalDateTime.now());
        serviceRequest.setUpdatedAt(LocalDateTime.now());

        // Inicializar timeline
        List<StatusTimeline> timeline = new ArrayList<>();
        StatusTimeline initialStatus = new StatusTimeline();
        initialStatus.setTimestamp(LocalDateTime.now());
        initialStatus.setStatus(ServiceRequestStatus.PENDIENTE);
        initialStatus.setBy(userEmail);
        timeline.add(initialStatus);
        serviceRequest.setTimeline(timeline);

        ServiceRequest saved = serviceRequestRepository.save(serviceRequest);
        log.info("Solicitud creada: {} para fecha: {}", saved.getRequestId(), saved.getFecha());

        // ENVIAR CORREO DE CONFIRMACIÓN
        try {
            String subject = "Confirmación de Solicitud - FireX #" + saved.getRequestId();
            String htmlContent;
            if (emailHtml != null && !emailHtml.isEmpty()) {
                htmlContent = emailHtml;
            } else {
                htmlContent = String.format(
                    "<h1>¡Solicitud Recibida!</h1>" +
                    "<p>Hola,</p>" +
                    "<p>Hemos recibido tu solicitud de servicio con el ID <strong>%s</strong>.</p>" +
                    "<h3>Detalles:</h3>" +
                    "<ul>" +
                    "<li><strong>Tipo:</strong> %s</li>" +
                    "<li><strong>Fecha:</strong> %s (%s)</li>" +
                    "<li><strong>Dirección:</strong> %s</li>" +
                    "</ul>" +
                    "<p>Un técnico se pondrá en contacto contigo pronto.</p>" +
                    "<br>" +
                    "<p>Atentamente,<br>Equipo FireX</p>",
                    saved.getRequestId(),
                    saved.getTipo(),
                    saved.getFecha(),
                    saved.getFranja(),
                    saved.getDireccion()
                );
            }
            
            emailService.sendHtmlEmail(userEmail, subject, htmlContent);
        } catch (Exception e) {
            log.error("No se pudo enviar el correo de confirmación: {}", e.getMessage());
            // No lanzamos excepción para no revertir la creación de la solicitud
        }

        return mapToServiceRequestResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponse getRequestById(String id) {
        log.debug("Buscando solicitud por ID: {}", id);

        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", "id", id));

        return mapToServiceRequestResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponse getRequestByRequestId(String requestId) {
        log.debug("Buscando solicitud por requestId: {}", requestId);

        ServiceRequest request = serviceRequestRepository.findByRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", "requestId", requestId));

        return mapToServiceRequestResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getRequestsByUserEmail(String userEmail) {
        log.debug("Obteniendo solicitudes del usuario: {}", userEmail);

        return serviceRequestRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getAllRequests() {
        log.debug("Obteniendo todas las solicitudes");

        return serviceRequestRepository.findAll().stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getRequestsByStatus(String status) {
        log.debug("Obteniendo solicitudes por estado: {}", status);

        ServiceRequestStatus requestStatus = parseStatus(status);

        return serviceRequestRepository.findByStatusOrderByCreatedAtAsc(requestStatus).stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceRequestResponse updateStatus(String id, String updatedBy, UpdateStatusRequest request) {
        log.info("Actualizando estado de solicitud: {} a {}", id, request.getStatus());

        ServiceRequest serviceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", "id", id));

        // Validar estado
        ServiceRequestStatus newStatus = parseStatus(request.getStatus());

        // Validación: No permitir retroceder estados (excepto casos especiales)
        validateStatusTransition(serviceRequest.getStatus(), newStatus);

        // Actualizar estado
        serviceRequest.setStatus(newStatus);
        serviceRequest.setUpdatedAt(LocalDateTime.now());

        // Agregar al timeline
        StatusTimeline timelineEntry = new StatusTimeline();
        timelineEntry.setTimestamp(LocalDateTime.now());
        timelineEntry.setStatus(newStatus);
        timelineEntry.setBy(updatedBy);
        serviceRequest.getTimeline().add(timelineEntry);

        ServiceRequest updated = serviceRequestRepository.save(serviceRequest);
        log.info("Estado actualizado: {} -> {}", id, newStatus);

        // NOTIFICACIÓN AUTOMÁTICA
        try {
            com.diedev.firex.models.Notification notification = new com.diedev.firex.models.Notification();
            notification.setTitle("Actualización de Servicio");
            notification.setMessage("Tu solicitud " + updated.getRequestId() + " ha cambiado a estado: " + newStatus);
            notification.setType(com.diedev.firex.enums.NotificationType.SERVICE_STATUS_CHANGED);
            notification.setPriority(com.diedev.firex.enums.NotificationPriority.MEDIUM);
            notification.setActionUrl("/requests/" + updated.getId());
            
            notificationService.sendNotification(updated.getUserId(), notification);
        } catch (Exception e) {
            log.error("Error enviando notificación automática: {}", e.getMessage());
        }

        return mapToServiceRequestResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRequest(String id) {
        log.info("Eliminando solicitud: {}", id);

        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud", "id", id));

        // Validación: Solo permitir eliminar solicitudes PENDIENTES o FINALIZADAS
        if (request.getStatus() != ServiceRequestStatus.PENDIENTE &&
                request.getStatus() != ServiceRequestStatus.FINALIZADO) {
            throw new BadRequestException(
                    "Solo se pueden eliminar solicitudes en estado PENDIENTE o FINALIZADO. " +
                            "Estado actual: " + request.getStatus()
            );
        }

        serviceRequestRepository.deleteById(id);
        log.info("Solicitud eliminada exitosamente: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(String status) {
        ServiceRequestStatus requestStatus = parseStatus(status);
        return serviceRequestRepository.countByStatus(requestStatus);
    }

    // ========== MÉTODOS DE VALIDACIÓN ==========

    /**
     * Valida que la fecha sea futura (no pasada)
     */
    private void validateFutureDate(String fechaStr) {
        try {
            LocalDate fecha = LocalDate.parse(fechaStr, DATE_FORMATTER);
            LocalDate hoy = LocalDate.now();

            if (fecha.isBefore(hoy)) {
                throw new BadRequestException(
                        String.format("La fecha no puede ser en el pasado. Fecha recibida: %s, Fecha actual: %s",
                                fechaStr, hoy)
                );
            }

            // Opcional: No permitir fechas muy lejanas (ej: más de 3 meses)
            LocalDate maxFecha = hoy.plusMonths(3);
            if (fecha.isAfter(maxFecha)) {
                throw new BadRequestException(
                        "La fecha no puede ser más de 3 meses en el futuro. Máximo: " + maxFecha
                );
            }

        } catch (DateTimeParseException e) {
            throw new BadRequestException("Formato de fecha inválido. Use: YYYY-MM-DD");
        }
    }

    /**
     * Valida teléfono colombiano (10 dígitos, empieza con 3)
     */
    private void validateColombianPhone(String phone) {
        if (!phone.matches("^3\\d{9}$")) {
            throw new BadRequestException(
                    "Teléfono inválido. Debe ser un celular colombiano de 10 dígitos comenzando con 3. " +
                            "Ejemplo: 3001234567"
            );
        }
    }

    /**
     * Valida que no exista solicitud duplicada del mismo usuario en la misma fecha
     */
    private void validateNoDuplicateRequest(String userEmail, String fecha) {
        List<ServiceRequest> existing = serviceRequestRepository.findByUserEmailAndStatus(
                userEmail,
                ServiceRequestStatus.PENDIENTE
        );

        boolean duplicada = existing.stream()
                .anyMatch(req -> req.getFecha().equals(fecha));

        if (duplicada) {
            throw new BadRequestException(
                    "Ya tienes una solicitud PENDIENTE para la fecha: " + fecha + ". " +
                            "Por favor espera a que sea procesada o elige otra fecha."
            );
        }
    }

    /**
     * Valida transiciones de estado permitidas
     */
    private void validateStatusTransition(ServiceRequestStatus currentStatus, ServiceRequestStatus newStatus) {
        // PENDIENTE -> cualquier estado (OK)
        if (currentStatus == ServiceRequestStatus.PENDIENTE) {
            return;
        }

        // FINALIZADO -> no se puede cambiar
        if (currentStatus == ServiceRequestStatus.FINALIZADO) {
            throw new BadRequestException(
                    "No se puede modificar una solicitud FINALIZADA"
            );
        }

        // Orden normal: PENDIENTE -> RECOGIDO -> EN_RECARGA -> LISTO -> ENTREGADO -> FINALIZADO
        List<ServiceRequestStatus> orden = List.of(
                ServiceRequestStatus.PENDIENTE,
                ServiceRequestStatus.RECOGIDO,
                ServiceRequestStatus.EN_RECARGA,
                ServiceRequestStatus.LISTO,
                ServiceRequestStatus.ENTREGADO,
                ServiceRequestStatus.FINALIZADO
        );

        int currentIndex = orden.indexOf(currentStatus);
        int newIndex = orden.indexOf(newStatus);

        // No permitir retroceder más de 1 estado
        if (newIndex < currentIndex - 1) {
            throw new BadRequestException(
                    String.format("Transición inválida: %s -> %s. No se puede retroceder más de un estado.",
                            currentStatus, newStatus)
            );
        }
    }

    /**
     * Parsea string a enum con validación
     */
    private ServiceRequestStatus parseStatus(String status) {
        try {
            return ServiceRequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                    "Estado inválido: " + status + ". Valores válidos: " +
                            String.join(", ", List.of("PENDIENTE", "RECOGIDO", "EN_RECARGA", "LISTO", "ENTREGADO", "FINALIZADO"))
            );
        }
    }

    // ========== MÉTODOS HELPER ==========

    private ServiceRequestResponse mapToServiceRequestResponse(ServiceRequest request) {
        List<TimelineResponse> timeline = request.getTimeline().stream()
                .map(this::mapToTimelineResponse)
                .collect(Collectors.toList());

        return ServiceRequestResponse.builder()
                .id(request.getId())
                .requestId(request.getRequestId())
                .userId(request.getUserId())
                .userEmail(request.getUserEmail())
                .tipo(request.getTipo())
                .estadoExtintor(request.getEstadoExtintor())
                .fecha(request.getFecha())
                .franja(request.getFranja())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .observaciones(request.getObservaciones())
                .status(request.getStatus().name())
                .timeline(timeline)
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    private TimelineResponse mapToTimelineResponse(StatusTimeline timeline) {
        return TimelineResponse.builder()
                .timestamp(timeline.getTimestamp())
                .status(timeline.getStatus().name())
                .by(timeline.getBy())
                .build();
    }
}