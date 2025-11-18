package com.diedev.firex.repositories;

import com.diedev.firex.models.Order;
import com.diedev.firex.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    /**
     * Buscar órdenes por usuario
     * @param userId ID del usuario
     * @return Lista de órdenes del usuario
     */
    List<Order> findByUserId(String userId);

    /**
     * Buscar órdenes por usuario ordenadas por fecha (más reciente primero)
     * @param userId ID del usuario
     * @return Lista ordenada de órdenes
     */
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Buscar órdenes por estado
     * @param status Estado de la orden
     * @return Lista de órdenes con ese estado
     */
    List<Order> findByStatus(OrderStatus status);

    /**
     * Buscar órdenes por usuario y estado
     * @param userId ID del usuario
     * @param status Estado de la orden
     * @return Lista de órdenes que coinciden
     */
    List<Order> findByUserIdAndStatus(String userId, OrderStatus status);

    /**
     * Buscar órdenes en un rango de fechas
     * @param startDate Fecha inicio
     * @param endDate Fecha fin
     * @return Lista de órdenes en ese rango
     */
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Contar órdenes por estado
     * @param status Estado a contar
     * @return Cantidad de órdenes
     */
    long countByStatus(OrderStatus status);

    /**
     * Contar órdenes de un usuario
     * @param userId ID del usuario
     * @return Cantidad de órdenes
     */
    long countByUserId(String userId);
}
