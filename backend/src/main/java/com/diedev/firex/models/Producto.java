package com.diedev.firex.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * Modelo de Producto con índices optimizados para búsquedas
 * ✅ ARREGLADO: Agregados índices para mejorar performance
 */
@Data
@Document(collection = "products")
@CompoundIndex(name = "category_stock_idx", def = "{'categoryId': 1, 'stock': -1}")
@CompoundIndex(name = "name_category_idx", def = "{'name': 1, 'categoryId': 1}")
public class Producto {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    private BigDecimal price;

    @Indexed
    private Integer stock;

    @Indexed
    private String categoryId;
}