package com.diedev.firex.repositories;

import com.diedev.firex.models.Categoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Categoria, String> {

    /**
     * Buscar categoría por nombre exacto (case insensitive)
     * @param name Nombre de la categoría
     * @return Optional con la categoría si existe
     */
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    Optional<Categoria> findByNameIgnoreCase(String name);

    /**
     * Verificar si existe una categoría con ese nombre
     * @param name Nombre a verificar
     * @return true si existe
     */
    @Query(value = "{'name': {$regex: ?0, $options: 'i'}}", exists = true)
    boolean existsByNameIgnoreCase(String name);

    /**
     * Buscar categorías por nombre parcial
     * @param name Texto a buscar
     * @return Lista de categorías que coinciden
     */
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Categoria> findByNameContaining(String name);

    /**
     * Obtener todas las categorías ordenadas por nombre
     * @return Lista ordenada de categorías
     */
    List<Categoria> findAllByOrderByNameAsc();
}