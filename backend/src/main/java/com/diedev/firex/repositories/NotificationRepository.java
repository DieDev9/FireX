package com.diedev.firex.repositories;

import com.diedev.firex.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    /**
     * Buscar notificaciones por usuario
     * @param userId ID del usuario
     * @return Lista de notificaciones del usuario
     */
    List<Notification> findByUserId(String userId);

    /**
     * Buscar notificaciones por usuario ordenadas por fecha (más reciente primero)
     * @param userId ID del usuario
     * @return Lista ordenada de notificaciones
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Buscar notificaciones no leídas por usuario
     * @param userId ID del usuario
     * @return Lista de notificaciones no leídas
     */
    List<Notification> findByUserIdAndReadFalse(String userId);

    /**
     * Buscar notificaciones por tipo
     * @param type Tipo de notificación
     * @return Lista de notificaciones de ese tipo
     */
    List<Notification> findByType(String type);

    /**
     * Buscar notificaciones por usuario y tipo
     * @param userId ID del usuario
     * @param type Tipo de notificación
     * @return Lista de notificaciones que coinciden
     */
    List<Notification> findByUserIdAndType(String userId, String type);

    /**
     * Marcar todas las notificaciones de un usuario como leídas
     * @param userId ID del usuario
     */
    @Query("{'userId': ?0}")
    void markAllAsReadByUserId(String userId);

    /**
     * Eliminar notificaciones antiguas
     * @param beforeDate Fecha límite
     */
    void deleteByCreatedAtBefore(LocalDateTime beforeDate);

    /**
     * Contar notificaciones no leídas por usuario
     * @param userId ID del usuario
     * @return Cantidad de notificaciones no leídas
     */
    long countByUserIdAndReadFalse(String userId);

    /**
     * Contar notificaciones por usuario
     * @param userId ID del usuario
     * @return Cantidad total de notificaciones
     */
    long countByUserId(String userId);
}