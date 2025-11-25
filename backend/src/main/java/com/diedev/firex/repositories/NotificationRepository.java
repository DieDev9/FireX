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
     * Buscar notificaciones por usuario ordenadas por fecha (más reciente primero)
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Buscar notificaciones no leídas por usuario ordenadas por fecha
     */
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    /**
     * Contar notificaciones no leídas por usuario
     */
    long countByUserIdAndReadFalse(String userId);

    /**
     * Marcar todas las notificaciones de un usuario como leídas
     * Nota: En MongoRepository esto requiere implementación custom o iteración en servicio,
     * pero podemos usar @Query para update si fuera necesario, o hacerlo en servicio.
     * Para simplificar, lo haremos en el servicio iterando o con MongoTemplate si fuera complejo.
     * Dejamos este método solo si es consulta. Para update masivo usaremos el servicio.
     */
    
    void deleteByUserId(String userId);
}