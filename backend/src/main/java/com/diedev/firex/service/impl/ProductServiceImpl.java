package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.ProductRequest;
import com.diedev.firex.dto.response.CategoryResponse;
import com.diedev.firex.dto.response.ProductResponse;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.models.Categoria;
import com.diedev.firex.models.Producto;
import com.diedev.firex.repositories.CategoryRepository;
import com.diedev.firex.repositories.ProductRepository;
import com.diedev.firex.service.interfaces.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de productos
 * ✅ ARREGLADO: Eliminadas las consultas N+1 usando cache de categorías
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        log.debug("Obteniendo todos los productos");

        List<Producto> productos = productRepository.findAll();

        // ✅ ARREGLO: Cargar todas las categorías UNA SOLA VEZ
        Map<String, Categoria> categoriaCache = loadCategoryCache(productos);

        return productos.stream()
                .map(producto -> mapToProductResponse(producto, categoriaCache))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(String id) {
        log.debug("Buscando producto por ID: {}", id);

        Producto producto = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        return mapToProductResponseWithCategory(producto);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creando nuevo producto: {}", request.getName());

        // Validar que la categoría existe
        Categoria categoria = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoryId()));

        // Validar nombre duplicado
        if (productRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Ya existe un producto con ese nombre");
        }

        // Validar precio positivo
        if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El precio debe ser mayor a 0");
        }

        Producto producto = new Producto();
        producto.setName(request.getName().trim());
        producto.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        producto.setPrice(request.getPrice());
        producto.setStock(request.getStock());
        producto.setCategoryId(request.getCategoryId());

        Producto savedProduct = productRepository.save(producto);
        log.info("✅ Producto creado con ID: {}", savedProduct.getId());

        return mapToProductResponse(savedProduct, categoria);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(String id, ProductRequest request) {
        log.info("Actualizando producto: {}", id);

        Producto producto = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        // Validar categoría si cambió
        Categoria categoria;
        if (!producto.getCategoryId().equals(request.getCategoryId())) {
            categoria = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoryId()));
        } else {
            categoria = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        // Validar nombre duplicado si cambió
        if (!producto.getName().equalsIgnoreCase(request.getName()) &&
                productRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Ya existe un producto con ese nombre");
        }

        // Validar precio positivo
        if (request.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El precio debe ser mayor a 0");
        }

        producto.setName(request.getName().trim());
        producto.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        producto.setPrice(request.getPrice());
        producto.setStock(request.getStock());
        producto.setCategoryId(request.getCategoryId());

        Producto updatedProduct = productRepository.save(producto);
        log.info("✅ Producto actualizado exitosamente: {}", updatedProduct.getName());

        return mapToProductResponse(updatedProduct, categoria);
    }

    @Override
    @Transactional
    public void deleteProduct(String id) {
        log.info("Eliminando producto: {}", id);

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", "id", id);
        }

        productRepository.deleteById(id);
        log.info("✅ Producto eliminado exitosamente: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String categoryId) {
        log.debug("Buscando productos por categoría: {}", categoryId);

        // Validar que la categoría existe
        Categoria categoria = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", categoryId));

        List<Producto> productos = productRepository.findByCategoryId(categoryId);

        return productos.stream()
                .map(producto -> mapToProductResponse(producto, categoria))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {
        log.debug("Buscando productos con keyword: {}", keyword);

        List<Producto> productos = productRepository.findByNameContaining(keyword);
        Map<String, Categoria> categoriaCache = loadCategoryCache(productos);

        return productos.stream()
                .map(producto -> mapToProductResponse(producto, categoriaCache))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAvailableProducts() {
        log.debug("Obteniendo productos disponibles (stock > 0)");

        List<Producto> productos = productRepository.findAvailableProducts();
        Map<String, Categoria> categoriaCache = loadCategoryCache(productos);

        return productos.stream()
                .map(producto -> mapToProductResponse(producto, categoriaCache))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts(int threshold) {
        log.debug("Obteniendo productos con stock bajo (threshold: {})", threshold);

        if (threshold < 0) {
            throw new BadRequestException("El umbral debe ser mayor o igual a 0");
        }

        List<Producto> productos = productRepository.findLowStockProducts(threshold);
        Map<String, Categoria> categoriaCache = loadCategoryCache(productos);

        return productos.stream()
                .map(producto -> mapToProductResponse(producto, categoriaCache))
                .collect(Collectors.toList());
    }

    // ========== MÉTODOS HELPER MEJORADOS ==========

    /**
     * ✅ NUEVO: Carga todas las categorías necesarias en UNA consulta
     * Evita el problema N+1 de consultas a la BD
     */
    private Map<String, Categoria> loadCategoryCache(List<Producto> productos) {
        // Extraer IDs únicos de categorías
        List<String> categoryIds = productos.stream()
                .map(Producto::getCategoryId)
                .distinct()
                .toList();

        // Cargar todas las categorías en UNA consulta
        List<Categoria> categorias = categoryRepository.findAllById(categoryIds);

        // Convertir a Map para acceso O(1)
        Map<String, Categoria> cache = new HashMap<>();
        categorias.forEach(cat -> cache.put(cat.getId(), cat));

        log.debug("✅ Cache de categorías cargado: {} categorías", cache.size());
        return cache;
    }

    /**
     * Mapea producto usando cache de categorías (sin consulta adicional)
     */
    private ProductResponse mapToProductResponse(Producto producto, Map<String, Categoria> categoriaCache) {
        Categoria categoria = categoriaCache.get(producto.getCategoryId());

        return ProductResponse.builder()
                .id(producto.getId())
                .name(producto.getName())
                .description(producto.getDescription())
                .price(producto.getPrice())
                .stock(producto.getStock())
                .category(categoria != null ? mapToCategoryResponse(categoria) : null)
                .build();
    }

    /**
     * Mapea producto con categoría ya cargada
     */
    private ProductResponse mapToProductResponse(Producto producto, Categoria categoria) {
        return ProductResponse.builder()
                .id(producto.getId())
                .name(producto.getName())
                .description(producto.getDescription())
                .price(producto.getPrice())
                .stock(producto.getStock())
                .category(categoria != null ? mapToCategoryResponse(categoria) : null)
                .build();
    }

    /**
     * Mapea producto cargando la categoría (solo para operaciones individuales)
     */
    private ProductResponse mapToProductResponseWithCategory(Producto producto) {
        Categoria categoria = null;

        if (producto.getCategoryId() != null && !producto.getCategoryId().isBlank()) {
            categoria = categoryRepository.findById(producto.getCategoryId()).orElse(null);
        }

        return mapToProductResponse(producto, categoria);
    }

    private CategoryResponse mapToCategoryResponse(Categoria categoria) {
        return CategoryResponse.builder()
                .id(categoria.getId())
                .name(categoria.getName())
                .description(categoria.getDescription())
                .build();
    }
}