package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.CartItemRequest;
import com.diedev.firex.dto.response.CartItemResponse;
import com.diedev.firex.dto.response.CartResponse;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.InsufficientStockException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.models.Cart;
import com.diedev.firex.models.CartItem;
import com.diedev.firex.models.Producto;
import com.diedev.firex.repositories.CartRepository;
import com.diedev.firex.repositories.ProductRepository;
import com.diedev.firex.service.interfaces.ICartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de carrito de compras
 * ✅ ARREGLADO: Validaciones mejoradas y límites de cantidad
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    // ✅ Constante: Límite máximo de items por producto en el carrito
    private static final int MAX_QUANTITY_PER_ITEM = 100;
    private static final int MAX_ITEMS_IN_CART = 50;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(String userId) {
        log.debug("Obteniendo carrito del usuario: {}", userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));

        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addOrUpdateItem(String userId, CartItemRequest request) {
        log.info("Agregando/actualizando item en carrito del usuario: {}", userId);

        // ✅ VALIDACIÓN 1: Cantidad razonable
        if (request.getQuantity() > MAX_QUANTITY_PER_ITEM) {
            throw new BadRequestException(
                    String.format("La cantidad máxima por producto es %d", MAX_QUANTITY_PER_ITEM)
            );
        }

        // ✅ VALIDACIÓN 2: Producto existe y tiene stock ANTES de hacer cambios
        Producto producto = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", request.getProductId()));

        // Verificar que el producto esté disponible
        if (producto.getStock() <= 0) {
            throw new InsufficientStockException(
                    String.format("El producto '%s' está agotado", producto.getName())
            );
        }

        if (producto.getStock() < request.getQuantity()) {
            throw new InsufficientStockException(
                    producto.getName(),
                    request.getQuantity(),
                    producto.getStock()
            );
        }

        // Obtener o crear carrito
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));

        // ✅ VALIDACIÓN 3: Límite de items diferentes en el carrito
        if (cart.getItems().size() >= MAX_ITEMS_IN_CART) {
            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getProductId().equals(request.getProductId()))
                    .findFirst();

            if (existingItem.isEmpty()) {
                throw new BadRequestException(
                        String.format("El carrito no puede tener más de %d productos diferentes", MAX_ITEMS_IN_CART)
                );
            }
        }

        // Buscar si el item ya existe
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Actualizar cantidad del item existente
            CartItem item = existingItem.get();
            int newQuantity = request.getQuantity();

            // Validar stock nuevamente con la nueva cantidad
            if (producto.getStock() < newQuantity) {
                throw new InsufficientStockException(
                        producto.getName(),
                        newQuantity,
                        producto.getStock()
                );
            }

            item.setQuantity(newQuantity);
            item.setPrice(producto.getPrice()); // ✅ Actualizar precio por si cambió
            item.setSubtotal(producto.getPrice().multiply(BigDecimal.valueOf(newQuantity)));

            log.info("✅ Item actualizado: {} (cantidad: {})", producto.getName(), newQuantity);
        } else {
            // Agregar nuevo item
            CartItem newItem = new CartItem();
            newItem.setProductId(producto.getId());
            newItem.setProductName(producto.getName());
            newItem.setPrice(producto.getPrice());
            newItem.setQuantity(request.getQuantity());
            newItem.setSubtotal(producto.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));

            cart.getItems().add(newItem);
            log.info("✅ Nuevo item agregado: {} (cantidad: {})", producto.getName(), request.getQuantity());
        }

        // Recalcular totales
        recalculateCartTotals(cart);

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(String userId, String productId) {
        log.info("Eliminando item del carrito del usuario: {}", userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "userId", userId));

        boolean removed = cart.getItems().removeIf(item -> item.getProductId().equals(productId));

        if (!removed) {
            throw new ResourceNotFoundException("Item en carrito", "productId", productId);
        }

        // Recalcular totales
        recalculateCartTotals(cart);

        Cart savedCart = cartRepository.save(cart);
        log.info("✅ Item eliminado del carrito: {}", productId);

        return mapToCartResponse(savedCart);
    }

    @Override
    @Transactional
    public void clearCart(String userId) {
        log.info("Vaciando carrito del usuario: {}", userId);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "userId", userId));

        cart.getItems().clear();
        cart.setTotalItems(0);
        cart.setTotalPrice(BigDecimal.ZERO);

        cartRepository.save(cart);
        log.info("✅ Carrito vaciado exitosamente: {}", userId);
    }

    // ========== MÉTODOS HELPER ==========

    /**
     * Crea un carrito vacío para un usuario
     */
    private Cart createEmptyCart(String userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setTotalItems(0);
        cart.setTotalPrice(BigDecimal.ZERO);

        Cart saved = cartRepository.save(cart);
        log.info("✅ Carrito vacío creado para usuario: {}", userId);
        return saved;
    }

    /**
     * Recalcula los totales del carrito
     */
    private void recalculateCartTotals(Cart cart) {
        int totalItems = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        BigDecimal totalPrice = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalItems(totalItems);
        cart.setTotalPrice(totalPrice);

        log.debug("Totales recalculados - Items: {}, Precio: ${}", totalItems, totalPrice);
    }

    /**
     * Mapea Cart a CartResponse
     */
    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(items)
                .totalItems(cart.getTotalItems())
                .totalPrice(cart.getTotalPrice())
                .build();
    }

    /**
     * Mapea CartItem a CartItemResponse
     */
    private CartItemResponse mapToCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .productId(item.getProductId())
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}