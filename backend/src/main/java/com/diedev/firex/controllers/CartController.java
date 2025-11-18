package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.CartItemRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.CartResponse;
import com.diedev.firex.service.interfaces.ICartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestión de carrito de compras
 * Base URL: /api/cart
 */
@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    /**
     * GET /api/cart/{userId}
     * Obtener carrito del usuario
     * Si no existe, se crea automáticamente
     *
     * @param userId ID del usuario
     * @return Carrito del usuario
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable String userId) {
        log.info("GET /api/cart/{}", userId);

        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Carrito obtenido", cart));
    }

    /**
     * POST /api/cart/{userId}/items
     * Agregar o actualizar item en el carrito
     * Si el producto ya existe, actualiza la cantidad
     *
     * @param userId ID del usuario
     * @param request Item a agregar/actualizar
     * @return Carrito actualizado
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<ApiResponse<CartResponse>> addOrUpdateItem(
            @PathVariable String userId,
            @Valid @RequestBody CartItemRequest request) {

        log.info("POST /api/cart/{}/items - ProductId: {}, Qty: {}",
                userId, request.getProductId(), request.getQuantity());

        CartResponse cart = cartService.addOrUpdateItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item agregado al carrito", cart));
    }

    /**
     * DELETE /api/cart/{userId}/items/{productId}
     * Eliminar item del carrito
     *
     * @param userId ID del usuario
     * @param productId ID del producto a eliminar
     * @return Carrito actualizado
     */
    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable String userId,
            @PathVariable String productId) {

        log.info("DELETE /api/cart/{}/items/{}", userId, productId);

        CartResponse cart = cartService.removeItem(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("Item eliminado del carrito", cart));
    }

    /**
     * DELETE /api/cart/{userId}
     * Vaciar completamente el carrito
     *
     * @param userId ID del usuario
     * @return Confirmación
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable String userId) {
        log.info("DELETE /api/cart/{}", userId);

        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Carrito vaciado exitosamente"));
    }
}