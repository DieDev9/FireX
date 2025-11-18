package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.ProductRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.ProductResponse;
import com.diedev.firex.service.interfaces.IProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de productos industriales
 */
@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        log.info("GET /api/products");
        List<ProductResponse> products = productService.getAllProducts();
        log.info("Se encontraron {} productos", products.size());
        return ResponseEntity.ok(
                ApiResponse.success("Productos obtenidos exitosamente", products)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable String id) {

        log.info("GET /api/products/{}", id);
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Producto encontrado", product)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request) {

        log.info("POST /api/products - Nombre: {}", request.getName());
        ProductResponse product = productService.createProduct(request);
        log.info("Producto creado con ID: {}", product.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Producto creado exitosamente", product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request) {

        log.info("PUT /api/products/{}", id);
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Producto actualizado exitosamente", product)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable String id) {

        log.info("DELETE /api/products/{}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                ApiResponse.success("Producto eliminado exitosamente")
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(
            @PathVariable String categoryId) {

        log.info("GET /api/products/category/{}", categoryId);
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(
                ApiResponse.success("Productos obtenidos", products)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam String keyword) {

        log.info("GET /api/products/search?keyword={}", keyword);
        List<ProductResponse> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(
                ApiResponse.success("Búsqueda completada", products)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAvailableProducts() {
        log.info("GET /api/products/available");
        List<ProductResponse> products = productService.getAvailableProducts();
        return ResponseEntity.ok(
                ApiResponse.success("Productos disponibles obtenidos", products)
        );
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {

        log.info("GET /api/products/low-stock?threshold={}", threshold);
        List<ProductResponse> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(
                ApiResponse.success("Productos con stock bajo obtenidos", products)
        );
    }
}
