package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.ServiceRequestRequest;
import com.diedev.firex.dto.request.UpdateStatusRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.ServiceRequestResponse;
import com.diedev.firex.service.interfaces.IServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de solicitudes de servicio (recargas)
 * Base URL: /api/service-requests
 */
@Slf4j
@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final IServiceRequestService serviceRequestService;

    /**
     * POST /api/service-requests
     * Crear nueva solicitud de servicio
     *
     * @param userId ID del usuario (desde header o JWT)
     * @param userEmail Email del usuario (desde header o JWT)
     * @param request Datos de la solicitud
     * @return Solicitud creada con ID único
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> createRequest(
            @RequestHeader("User-Id") String userId,
            @RequestHeader("User-Email") String userEmail,
            @Valid @RequestBody ServiceRequestRequest request) {

        log.info("POST /api/service-requests - User: {}", userEmail);

        ServiceRequestResponse serviceRequest = serviceRequestService.createRequest(userId, userEmail, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Solicitud creada exitosamente", serviceRequest));
    }

    /**
     * GET /api/service-requests/{id}
     * Obtener solicitud por ID
     *
     * @param id ID de la solicitud
     * @return Solicitud encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> getRequestById(@PathVariable String id) {
        log.info("GET /api/service-requests/{}", id);

        ServiceRequestResponse serviceRequest = serviceRequestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.success("Solicitud encontrada", serviceRequest));
    }

    /**
     * GET /api/service-requests/request/{requestId}
     * Obtener solicitud por requestId único (ej: SR-1234567890)
     *
     * @param requestId Request ID único
     * @return Solicitud encontrada
     */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> getRequestByRequestId(@PathVariable String requestId) {
        log.info("GET /api/service-requests/request/{}", requestId);

        ServiceRequestResponse serviceRequest = serviceRequestService.getRequestByRequestId(requestId);
        return ResponseEntity.ok(ApiResponse.success("Solicitud encontrada", serviceRequest));
    }

    /**
     * GET /api/service-requests/my-requests?email=xxx
     * Obtener solicitudes del usuario
     *
     * @param email Email del usuario
     * @return Lista de solicitudes del usuario ordenadas por fecha
     */
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<ServiceRequestResponse>>> getMyRequests(@RequestParam String email) {
        log.info("GET /api/service-requests/my-requests?email={}", email);

        List<ServiceRequestResponse> requests = serviceRequestService.getRequestsByUserEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Solicitudes obtenidas", requests));
    }

    /**
     * GET /api/service-requests
     * Obtener todas las solicitudes (ADMIN)
     *
     * @return Lista de todas las solicitudes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceRequestResponse>>> getAllRequests() {
        log.info("GET /api/service-requests");

        List<ServiceRequestResponse> requests = serviceRequestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success("Solicitudes obtenidas", requests));
    }

    /**
     * GET /api/service-requests/status/{status}
     * Obtener solicitudes por estado
     * Estados: PENDIENTE, RECOGIDO, EN_RECARGA, LISTO, ENTREGADO, FINALIZADO
     *
     * @param status Estado de la solicitud
     * @return Lista de solicitudes con ese estado
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ServiceRequestResponse>>> getRequestsByStatus(@PathVariable String status) {
        log.info("GET /api/service-requests/status/{}", status);

        List<ServiceRequestResponse> requests = serviceRequestService.getRequestsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Solicitudes obtenidas", requests));
    }

    /**
     * PUT /api/service-requests/{id}/status
     * Actualizar estado de solicitud (ADMIN)
     *
     * @param id ID de la solicitud
     * @param updatedBy Usuario que realiza la actualización
     * @param request Nuevo estado
     * @return Solicitud actualizada con timeline
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ServiceRequestResponse>> updateStatus(
            @PathVariable String id,
            @RequestHeader("Updated-By") String updatedBy,
            @Valid @RequestBody UpdateStatusRequest request) {

        log.info("PUT /api/service-requests/{}/status - New status: {}", id, request.getStatus());

        ServiceRequestResponse serviceRequest = serviceRequestService.updateStatus(id, updatedBy, request);
        return ResponseEntity.ok(ApiResponse.success("Estado actualizado exitosamente", serviceRequest));
    }

    /**
     * DELETE /api/service-requests/{id}
     * Eliminar solicitud (ADMIN)
     *
     * @param id ID de la solicitud
     * @return Confirmación de eliminación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable String id) {
        log.info("DELETE /api/service-requests/{}", id);

        serviceRequestService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Solicitud eliminada exitosamente"));
    }

    /**
     * GET /api/service-requests/stats
     * Obtener estadísticas de solicitudes (ADMIN)
     *
     * @return Estadísticas por estado
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        log.info("GET /api/service-requests/stats");

        Map<String, Long> stats = new HashMap<>();
        stats.put("PENDIENTE", serviceRequestService.countByStatus("PENDIENTE"));
        stats.put("RECOGIDO", serviceRequestService.countByStatus("RECOGIDO"));
        stats.put("EN_RECARGA", serviceRequestService.countByStatus("EN_RECARGA"));
        stats.put("LISTO", serviceRequestService.countByStatus("LISTO"));
        stats.put("FINALIZADO", serviceRequestService.countByStatus("FINALIZADO"));

        return ResponseEntity.ok(ApiResponse.success("Estadísticas obtenidas", stats));
    }
}