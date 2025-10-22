package co.edu.uis.sistemas.ecommerce.carrito.controller;

import co.edu.uis.sistemas.ecommerce.carrito.model.Product;
import co.edu.uis.sistemas.ecommerce.carrito.dtos.ShoppingCartDTO;
import co.edu.uis.sistemas.ecommerce.carrito.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/shopping_cart")
public class ProductCacheController {

    private final ShoppingCartService shoppingCartService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ProductCacheController.class);

    public ProductCacheController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ShoppingCartDTO> getCart(@PathVariable String userId) {
        // La excepción NoSuchElementException será manejada por GlobalExceptionHandler
        return ResponseEntity.ok(shoppingCartService.getCartByUserId(userId));
    }

    @DeleteMapping("/{userId}/empty")
    public ResponseEntity<Void> emptyShoppingCart(@PathVariable String userId) {
        shoppingCartService.emptyCartByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/products/{productId}")
    public ResponseEntity<Void> deleteProductFromCart(@PathVariable String userId,
                                                      @PathVariable Long productId) {
        shoppingCartService.deleteProductFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ShoppingCartDTO> updateFullCart(@PathVariable String userId,
                                                          @RequestBody ShoppingCartDTO shoppingCartDTO) {
        // Validar que el userId en el path coincida con el del body si es necesario
        if (!userId.equals(shoppingCartDTO.userID())) {
            // Considerar lanzar una excepción o manejar como Bad Request
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(shoppingCartService.updateCartProducts(shoppingCartDTO));
    }

    @PatchMapping("/{userId}/products/{productId}/quantity")
    public ResponseEntity<ShoppingCartDTO> updateProductQuantity(
            @PathVariable String userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        ShoppingCartDTO updatedCart = shoppingCartService.updateProductQuantityInCart(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }
}
