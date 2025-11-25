package com.diedev.firex.dto.response;


import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private String id;
    private String userId;
    private List<CartItemResponse> items;
    private Integer totalItems;
    private BigDecimal totalPrice;

    public CartResponse() {}

    public CartResponse(String id, String userId, List<CartItemResponse> items, Integer totalItems, BigDecimal totalPrice) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalItems = totalItems;
        this.totalPrice = totalPrice;
    }

    public static CartResponseBuilder builder() {
        return new CartResponseBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public static class CartResponseBuilder {
        private String id;
        private String userId;
        private List<CartItemResponse> items;
        private Integer totalItems;
        private BigDecimal totalPrice;

        CartResponseBuilder() {}

        public CartResponseBuilder id(String id) { this.id = id; return this; }
        public CartResponseBuilder userId(String userId) { this.userId = userId; return this; }
        public CartResponseBuilder items(List<CartItemResponse> items) { this.items = items; return this; }
        public CartResponseBuilder totalItems(Integer totalItems) { this.totalItems = totalItems; return this; }
        public CartResponseBuilder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

        public CartResponse build() {
            return new CartResponse(id, userId, items, totalItems, totalPrice);
        }
    }
}