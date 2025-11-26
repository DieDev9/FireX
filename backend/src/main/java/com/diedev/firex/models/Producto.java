package com.diedev.firex.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * Modelo de Producto con índices optimizados para búsquedas
 * Agregados índices para mejorar performance
 */
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

    private String imageUrl;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}