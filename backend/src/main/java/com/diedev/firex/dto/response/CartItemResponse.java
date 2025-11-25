package com.diedev.firex.dto.response;


import java.math.BigDecimal;

public class CartItemResponse {
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemResponse() {}

    public CartItemResponse(String productId, String productName, BigDecimal price, Integer quantity, BigDecimal subtotal) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public static CartItemResponseBuilder builder() {
        return new CartItemResponseBuilder();
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public static class CartItemResponseBuilder {
        private String productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;

        CartItemResponseBuilder() {}

        public CartItemResponseBuilder productId(String productId) { this.productId = productId; return this; }
        public CartItemResponseBuilder productName(String productName) { this.productName = productName; return this; }
        public CartItemResponseBuilder price(BigDecimal price) { this.price = price; return this; }
        public CartItemResponseBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public CartItemResponseBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }

        public CartItemResponse build() {
            return new CartItemResponse(productId, productName, price, quantity, subtotal);
        }
    }
}