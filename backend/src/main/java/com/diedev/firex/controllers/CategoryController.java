package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.CategoryRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.CategoryResponse;
import com.diedev.firex.service.interfaces.ICategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de categorías
 * Base URL: /api/categories
 */
@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ICategoryService categoryService;

    /**
     * GET /api/categories
     * Obtener todas las categorías
     *
     * @return Lista de categorías ordenadas alfabéticamente
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        log.info("GET /api/categories");

        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categorías obtenidas", categories));
    }

    /**
     * GET /api/categories/{id}
     * Obtener categoría por ID
     *
     * @param id ID de la categoría
     * @return Categoría encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable String id) {
        log.info("GET /api/categories/{}", id);

        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Categoría encontrada", category));
    }

    /**
     * POST /api/categories
     * Crear nueva categoría (ADMIN)
     *
     * @param request Datos de la categoría
     * @return Categoría creada
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("POST /api/categories - Name: {}", request.getName());

        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Categoría creada exitosamente", category));
    }

    /**
     * PUT /api/categories/{id}
     * Actualizar categoría (ADMIN)
     *
     * @param id ID de la categoría
     * @param request Datos actualizados
     * @return Categoría actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable String id,
            @Valid @RequestBody CategoryRequest request) {

        log.info("PUT /api/categories/{}", id);

        CategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Categoría actualizada exitosamente", category));
    }

    /**
     * DELETE /api/categories/{id}
     * Eliminar categoría (ADMIN)
     * Nota: No se puede eliminar si tiene productos asociados
     *
     * @param id ID de la categoría
     * @return Confirmación de eliminación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        log.info("DELETE /api/categories/{}", id);

        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Categoría eliminada exitosamente"));
    }
}