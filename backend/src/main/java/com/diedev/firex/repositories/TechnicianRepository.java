package com.diedev.firex.repositories;

import com.diedev.firex.models.Technician;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends MongoRepository<Technician, String> {

    /**
     * Buscar técnicos activos
     * @return Lista de técnicos activos
     */
    List<Technician> findByActiveTrue();

    /**
     * Buscar técnicos por zona
     * @param zone Zona de servicio
     * @return Lista de técnicos en esa zona
     */
    List<Technician> findByZone(String zone);

    /**
     * Buscar técnicos activos por zona
     * @param zone Zona de servicio
     * @return Lista de técnicos activos en esa zona
     */
    List<Technician> findByZoneAndActiveTrue(String zone);

    /**
     * Buscar técnico por teléfono
     * @param phone Teléfono del técnico
     * @return Optional con el técnico si existe
     */
    Optional<Technician> findByPhone(String phone);

    /**
     * Buscar técnicos por especialidad
     * @param specialty Especialidad a buscar
     * @return Lista de técnicos con esa especialidad
     */
    @Query("{'specialty': ?0}")
    List<Technician> findBySpecialty(String specialty);

    /**
     * Contar técnicos activos
     * @return Cantidad de técnicos activos
     */
    long countByActiveTrue();

    /**
     * Contar técnicos por zona
     * @param zone Zona a contar
     * @return Cantidad de técnicos
     */
    long countByZone(String zone);
}