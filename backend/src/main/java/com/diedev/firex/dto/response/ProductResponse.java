package com.diedev.firex.dto.response;


import java.math.BigDecimal;

public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private CategoryResponse category;

    public ProductResponse() {}

    public ProductResponse(String id, String name, String description, BigDecimal price, Integer stock, CategoryResponse category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }

    public static ProductResponseBuilder builder() {
        return new ProductResponseBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public static class ProductResponseBuilder {
        private String id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stock;
        private CategoryResponse category;

        ProductResponseBuilder() {}

        public ProductResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public ProductResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductResponseBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public ProductResponseBuilder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public ProductResponseBuilder category(CategoryResponse category) {
            this.category = category;
            return this;
        }

        public ProductResponse build() {
            return new ProductResponse(id, name, description, price, stock, category);
        }
    }
}
