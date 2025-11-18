package com.diedev.firex.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para creación/actualización de productos
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear o actualizar un producto")
public class ProductRequest {

    @Schema(
            description = "Nombre del producto",
            example = "Extintor ABC 10kg",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Schema(
            description = "Descripción detallada del producto",
            example = "Extintor de polvo químico seco ABC para incendios clase A, B y C"
    )
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;

    @Schema(
            description = "Precio del producto en pesos colombianos",
            example = "150000",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "El precio es requerido")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal price;

    @Schema(
            description = "Cantidad disponible en inventario",
            example = "50",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "El stock es requerido")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @Schema(
            description = "ID de la categoría a la que pertenece el producto",
            example = "674e9b2c1234567890abcdef",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "La categoría es requerida")
    private String categoryId;
}