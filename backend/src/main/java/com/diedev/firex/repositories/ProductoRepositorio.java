package com.diedev.firex.repositories;

import com.diedev.firex.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {
}