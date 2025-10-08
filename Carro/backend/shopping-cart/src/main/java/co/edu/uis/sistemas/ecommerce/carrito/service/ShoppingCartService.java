package co.edu.uis.sistemas.ecommerce.carrito.service;


import co.edu.uis.sistemas.ecommerce.carrito.dtos.ProductDTO;
import co.edu.uis.sistemas.ecommerce.carrito.dtos.ShoppingCartDTO;

/**
 *
 */
public interface ShoppingCartService {
    void addProductToCart(ProductDTO productRequestDTO);
    ShoppingCartDTO getCartByUserId(String userId);
    void deleteProductFromCart(String userId, Long productId);
    void emptyCartByUserId(String userId);
    ShoppingCartDTO updateCartProducts(ShoppingCartDTO shoppingCartDTO);
    ShoppingCartDTO updateProductQuantityInCart(String userId, Long productId, Integer quantity);

}

