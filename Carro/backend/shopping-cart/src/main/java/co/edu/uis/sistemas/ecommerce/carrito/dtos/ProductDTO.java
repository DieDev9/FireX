package co.edu.uis.sistemas.ecommerce.carrito.dtos;

import java.io.Serializable;

public record ProductDTO(
    Long id,
    String userId,
    String name,
    Double price,
    Integer amount
) implements Serializable {}
