package co.edu.uis.sistemas.ecommerce.carrito.service.impl;


import co.edu.uis.sistemas.ecommerce.carrito.mapper.ProductMapper;
import co.edu.uis.sistemas.ecommerce.carrito.model.Product;
import co.edu.uis.sistemas.ecommerce.carrito.dtos.ProductDTO;
import co.edu.uis.sistemas.ecommerce.carrito.dtos.ShoppingCartDTO;
import co.edu.uis.sistemas.ecommerce.carrito.service.ShoppingCartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

@Service
public class ProductCacheServiceImpl implements ShoppingCartService {
    // Constantes
    private static final Logger LOGGER = LoggerFactory.getLogger(ProductCacheServiceImpl.class);
    private static final long CART_TTL_MINUTES = 2;
    // Dependencias
    private final ProductMapper mapper;
    // Base de datos
    private final RedisTemplate<String, List<Product>> redisTemplate;

    public ProductCacheServiceImpl(ProductMapper mapper, RedisTemplate<String, List<Product>> redisTemplate) {
        this.mapper = mapper;
        this.redisTemplate = redisTemplate;
    }

    // --- Métodos funcionales ---

    @Override
    public void addProductToCart(ProductDTO productRequestDTO) {
        String key = getKey(productRequestDTO.userId());
        List<Product> productsInCart = getProductsFromRedis(key);

        // Lógica para agregar o actualizar si el producto ya existe
        Optional<Product> existingProductOpt = productsInCart.stream()
                .filter(p -> p.getId().equals(productRequestDTO.id()))
                .findFirst();

        if (existingProductOpt.isPresent()) {
            // Si el producto ya existe, actualiza la cantidad
            Product existingProduct = existingProductOpt.get();
            existingProduct.setAmount(productRequestDTO.amount()); // O existingProduct.setAmount(existingProduct.getAmount() + productRequestDTO.getAmount());
            existingProduct.setPrice(productRequestDTO.price()); // Actualizar precio por si cambió
            existingProduct.setName(productRequestDTO.name()); // Actualizar nombre
            LOGGER.info("Product {} updated in cart for user {}: {}", existingProduct.getId(), productRequestDTO.userId(), existingProduct);
        } else {
            // Si el producto no existe, lo convierte y lo agrega
            Product productModel = mapper.productDTOToProduct(productRequestDTO);
            productsInCart.add(productModel);
            LOGGER.info("Product {} added to cart for user {}: {}", productModel.getId(), productRequestDTO.userId(), productModel);
        }
        redisTemplate.opsForValue().set(key, productsInCart);
    }

    @Override
    public ShoppingCartDTO getCartByUserId(String userId) {
        String key = getKey(userId);
        List<Product> productsInCart = getProductsFromRedis(key);
        if (productsInCart.isEmpty() && !redisTemplate.hasKey(key)) { // Distinguir carrito vacío de usuario sin carrito
            redisTemplate.expire(key, Duration.ofMinutes(CART_TTL_MINUTES));
            throw new NoSuchElementException("Shopping cart not found or is empty for user: " + userId);
        }
        List<ProductDTO> productDTOs = mapper.productsToProductDTOs(productsInCart);
        LOGGER.info("Shopping cart found for user: {}", userId);
        return new ShoppingCartDTO(userId, productDTOs);
    }

    @Override
    public void deleteProductFromCart(String userId, Long productId) {
        String key = getKey(userId);
        List<Product> products = getProductsFromRedis(key);
        boolean removed = products.removeIf(product -> product.getId().equals(productId));
        if (!removed) {
            LOGGER.warn("Product with ID {} not found in cart for user {} during delete.", productId, userId);
        }
        redisTemplate.opsForValue().set(key, products); // Guardar incluso si está vacía para mantener la clave
    }

    @Override
    public void emptyCartByUserId(String userId) {
        redisTemplate.delete(getKey(userId));
        LOGGER.info("Shopping cart emptied for user: {}", userId);
    }

    @Override
    public ShoppingCartDTO updateCartProducts(ShoppingCartDTO shoppingCartDTO) {
        String key = getKey(shoppingCartDTO.userID());
        List<Product> currentProductsInCart = getProductsFromRedis(key);

        if (currentProductsInCart.isEmpty() && !redisTemplate.hasKey(key)) { // Si no hay carrito previo
            throw new NoSuchElementException("Shopping cart not found for user: " + shoppingCartDTO.userID() + ". Cannot update.");
        }

        List<Product> updatedProductsFromDTO = mapper.productDTOsToProducts(shoppingCartDTO.products());

        // Lógica de actualización: Reemplazar la lista o hacer un merge más inteligente.
        // Esta es una simple sustitución de la lista de productos del carrito:
        redisTemplate.opsForValue().set(key, updatedProductsFromDTO);
        LOGGER.info("Shopping cart updated for user: {}", shoppingCartDTO.userID());
        return new ShoppingCartDTO(shoppingCartDTO.userID(), mapper.productsToProductDTOs(updatedProductsFromDTO));
    }

    @Override
    public ShoppingCartDTO updateProductQuantityInCart(String userId, Long productId, Integer quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative.");
        }

        String key = getKey(userId);
        List<Product> products = getProductsFromRedis(key);

        if (products.isEmpty() && !redisTemplate.hasKey(key)) {
            throw new NoSuchElementException("Shopping cart is empty for user: " + userId);
        }

        Optional<Product> productToUpdateOpt = products.stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst();

        if (productToUpdateOpt.isPresent()) {
            if (quantity == 0) {
                products.removeIf(p -> p.getId().equals(productId));
                LOGGER.info("Product {} removed from cart for user {} due to quantity 0.", productId, userId);
            } else {
                Product product = productToUpdateOpt.get();
                product.setAmount(quantity);
                LOGGER.info("Updated quantity for product {} to {} for user {}.", productId, quantity, userId);
            }
        } else {
            if (quantity > 0) { // Solo lanzar error si se intenta actualizar un producto inexistente a una cantidad > 0
                throw new NoSuchElementException("Product with ID " + productId + " not found in cart for user: " + userId);
            }
            // Si quantity es 0 y el producto no existe, no hacer nada.
        }
        redisTemplate.opsForValue().set(key, products);
        return new ShoppingCartDTO(userId, mapper.productsToProductDTOs(products));
    }

    // --- Métodos privados ---

    private String getKey(String userId) {
        return "cart:" + userId;
    }

    private List<Product> getProductsFromRedis(String key) {
        List<Product> products = redisTemplate.opsForValue().get(key);
        return (products == null) ? new ArrayList<>() : products;
    }
}
