package co.edu.uis.sistemas.ecommerce.carrito.dtos;

import co.edu.uis.sistemas.ecommerce.carrito.model.Product;
import java.io.Serializable;
import java.util.List;

public record ShoppingCartDTO(
        String userID,
        List<ProductDTO> products
) implements Serializable {
}
