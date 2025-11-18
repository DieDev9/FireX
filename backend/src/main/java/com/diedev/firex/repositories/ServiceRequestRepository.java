package com.diedev.firex.repositories;

import com.diedev.firex.models.ServiceRequest;
import com.diedev.firex.enums.ServiceRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends MongoRepository<ServiceRequest, String> {

    /**
     * Buscar solicitud por requestId único
     * @param requestId ID de solicitud (ej: SR-timestamp)
     * @return Optional con la solicitud si existe
     */
    Optional<ServiceRequest> findByRequestId(String requestId);

    /**
     * Buscar solicitudes por email de usuario
     * @param userEmail Email del usuario
     * @return Lista de solicitudes del usuario
     */
    List<ServiceRequest> findByUserEmail(String userEmail);

    /**
     * Buscar solicitudes por email ordenadas por fecha (más reciente primero)
     * @param userEmail Email del usuario
     * @return Lista ordenada de solicitudes
     */
    List<ServiceRequest> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    /**
     * Buscar solicitudes por userId
     * @param userId ID del usuario
     * @return Lista de solicitudes del usuario
     */
    List<ServiceRequest> findByUserId(String userId);

    /**
     * Buscar solicitudes por estado
     * @param status Estado de la solicitud
     * @return Lista de solicitudes con ese estado
     */
    List<ServiceRequest> findByStatus(ServiceRequestStatus status);

    /**
     * Buscar solicitudes por estado ordenadas por fecha
     * @param status Estado de la solicitud
     * @return Lista ordenada de solicitudes
     */
    List<ServiceRequest> findByStatusOrderByCreatedAtAsc(ServiceRequestStatus status);

    /**
     * Buscar solicitudes por usuario y estado
     * @param userEmail Email del usuario
     * @param status Estado de la solicitud
     * @return Lista de solicitudes que coinciden
     */
    List<ServiceRequest> findByUserEmailAndStatus(String userEmail, ServiceRequestStatus status);

    /**
     * Buscar solicitudes por tipo de extintor
     * @param tipo Tipo de extintor (ABC, CO2, H2O, K)
     * @return Lista de solicitudes de ese tipo
     */
    List<ServiceRequest> findByTipo(String tipo);

    /**
     * Buscar solicitudes por fecha programada
     * @param fecha Fecha en formato String (YYYY-MM-DD)
     * @return Lista de solicitudes para esa fecha
     */
    List<ServiceRequest> findByFecha(String fecha);

    /**
     * Buscar solicitudes en un rango de fechas de creación
     * @param startDate Fecha inicio
     * @param endDate Fecha fin
     * @return Lista de solicitudes en ese rango
     */
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<ServiceRequest> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Buscar solicitudes pendientes más antiguas
     * @param limit Límite de resultados
     * @return Lista de solicitudes pendientes ordenadas
     */
    @Query("{'status': 'PENDIENTE'}")
    List<ServiceRequest> findOldestPendingRequests();

    /**
     * Contar solicitudes por estado
     * @param status Estado a contar
     * @return Cantidad de solicitudes
     */
    long countByStatus(ServiceRequestStatus status);

    /**
     * Contar solicitudes de un usuario
     * @param userEmail Email del usuario
     * @return Cantidad de solicitudes
     */
    long countByUserEmail(String userEmail);

    /**
     * Verificar si existe una solicitud con ese requestId
     * @param requestId ID de solicitud
     * @return true si existe
     */
    boolean existsByRequestId(String requestId);
}
