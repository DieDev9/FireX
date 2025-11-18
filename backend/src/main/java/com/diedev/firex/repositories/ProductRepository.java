package com.diedev.firex.repositories;

import com.diedev.firex.models.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Producto, String> {

    /**
     * Buscar productos por categoría
     * @param categoryId ID de la categoría
     * @return Lista de productos
     */
    List<Producto> findByCategoryId(String categoryId);

    /**
     * Buscar productos con stock disponible
     * @return Lista de productos con stock > 0
     */
    @Query("{'stock': {$gt: 0}}")
    List<Producto> findAvailableProducts();

    /**
     * Buscar productos por nombre (búsqueda parcial, case insensitive)
     * @param name Nombre a buscar
     * @return Lista de productos que coinciden
     */
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Producto> findByNameContaining(String name);

    /**
     * Buscar productos por rango de precio
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Lista de productos en ese rango
     */
    @Query("{'price': {$gte: ?0, $lte: ?1}}")
    List<Producto> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Buscar productos con stock bajo
     * @param threshold Umbral de stock
     * @return Lista de productos con stock <= threshold
     */
    @Query("{'stock': {$lte: ?0, $gt: 0}}")
    List<Producto> findLowStockProducts(int threshold);

    /**
     * Buscar productos agotados
     * @return Lista de productos con stock = 0
     */
    @Query("{'stock': 0}")
    List<Producto> findOutOfStockProducts();

    /**
     * Contar productos por categoría
     * @param categoryId ID de la categoría
     * @return Cantidad de productos
     */
    long countByCategoryId(String categoryId);

    /**
     * Verificar si existe un producto por nombre (case insensitive)
     * @param name Nombre del producto
     * @return true si existe
     */
    @Query(value = "{'name': {$regex: ?0, $options: 'i'}}", exists = true)
    boolean existsByNameIgnoreCase(String name);
}