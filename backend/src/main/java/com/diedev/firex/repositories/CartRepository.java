package com.diedev.firex.repositories;

import com.diedev.firex.models.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {

    /**
     * Buscar carrito por usuario
     * @param userId ID del usuario
     * @return Optional con el carrito si existe
     */
    Optional<Cart> findByUserId(String userId);

    /**
     * Verificar si existe un carrito para el usuario
     * @param userId ID del usuario
     * @return true si existe
     */
    boolean existsByUserId(String userId);

    /**
     * Eliminar carrito por usuario
     * @param userId ID del usuario
     */
    void deleteByUserId(String userId);

    /**
     * Contar carritos activos (con items)
     * @return Cantidad de carritos con totalItems > 0
     */
    @Query(value = "{'totalItems': {$gt: 0}}", count = true)
    long countActiveCartsByTotalItemsGreaterThan();
}