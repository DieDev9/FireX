package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.CategoryRequest;
import com.diedev.firex.dto.response.CategoryResponse;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.models.Categoria;
import com.diedev.firex.repositories.CategoryRepository;
import com.diedev.firex.repositories.ProductRepository;
import com.diedev.firex.service.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        log.debug("Obteniendo todas las categorías");

        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(String id) {
        log.debug("Buscando categoría por ID: {}", id);

        Categoria categoria = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));

        return mapToCategoryResponse(categoria);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creando nueva categoría: {}", request.getName());

        // Validar nombre duplicado
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setName(request.getName());
        categoria.setDescription(request.getDescription());

        Categoria savedCategory = categoryRepository.save(categoria);
        log.info("Categoría creada exitosamente: {}", savedCategory.getName());

        return mapToCategoryResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        log.info("Actualizando categoría: {}", id);

        Categoria categoria = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));

        // Validar nombre duplicado si cambió
        if (!categoria.getName().equalsIgnoreCase(request.getName()) &&
                categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Ya existe una categoría con ese nombre");
        }

        categoria.setName(request.getName());
        categoria.setDescription(request.getDescription());

        Categoria updatedCategory = categoryRepository.save(categoria);
        log.info("Categoría actualizada exitosamente: {}", updatedCategory.getName());

        return mapToCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(String id) {
        log.info("Eliminando categoría: {}", id);

        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", "id", id);
        }

        // Verificar si tiene productos asociados
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new BadRequestException(
                    String.format("No se puede eliminar la categoría porque tiene %d productos asociados", productCount)
            );
        }

        categoryRepository.deleteById(id);
        log.info("Categoría eliminada exitosamente: {}", id);
    }

    // Helper method
    private CategoryResponse mapToCategoryResponse(Categoria categoria) {
        return CategoryResponse.builder()
                .id(categoria.getId())
                .name(categoria.getName())
                .description(categoria.getDescription())
                .build();
    }
}