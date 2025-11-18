package com.diedev.firex.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestRequest {

    @NotBlank(message = "El tipo de extintor es requerido")
    @Pattern(regexp = "ABC|CO2|H2O|K", message = "Tipo de extintor inválido")
    private String tipo;

    @NotBlank(message = "El estado del extintor es requerido")
    @Pattern(regexp = "Operativo|Descargado|Vencido", message = "Estado inválido")
    private String estadoExtintor;

    @NotBlank(message = "La fecha es requerida")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Formato de fecha inválido (YYYY-MM-DD)")
    private String fecha;

    @NotBlank(message = "La franja horaria es requerida")
    @Pattern(regexp = "Mañana|Tarde", message = "Franja horaria inválida")
    private String franja;

    @NotBlank(message = "La dirección es requerida")
    private String direccion;

    @NotBlank(message = "El teléfono es requerido")
    private String telefono;

    private String observaciones;
}