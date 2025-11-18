package com.diedev.firex.models;

import com.diedev.firex.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String userId;

    private List<OrderItem> items = new ArrayList<>();

    private BigDecimal totalAmount;
    private OrderStatus status;
    private String shippingAddress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}