package com.diedev.firex.repositories;

import com.diedev.firex.models.AppUser;
import com.diedev.firex.enums.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AppUser, String> {

    /**
     * Buscar usuario por email
     * @param email Email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<AppUser> findByEmail(String email);

    /**
     * Verificar si existe un usuario con un email
     * @param email Email a verificar
     * @return true si existe
     */
    boolean existsByEmail(String email);

    /**
     * Buscar usuarios por rol
     * @param role Rol a buscar
     * @return Lista de usuarios con ese rol
     */
    List<AppUser> findByRole(UserRole role);

    /**
     * Buscar usuarios por nombre (búsqueda parcial, case insensitive)
     * @param name Nombre a buscar
     * @return Lista de usuarios que coinciden
     */
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<AppUser> findByNameContaining(String name);

    /**
     * Contar usuarios por rol
     * @param role Rol a contar
     * @return Cantidad de usuarios
     */
    long countByRole(UserRole role);
}