package com.diedev.firex.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

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

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEstadoExtintor() { return estadoExtintor; }
    public void setEstadoExtintor(String estadoExtintor) { this.estadoExtintor = estadoExtintor; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getFranja() { return franja; }
    public void setFranja(String franja) { this.franja = franja; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    private String emailHtml;
    public String getEmailHtml() { return emailHtml; }
    public void setEmailHtml(String emailHtml) { this.emailHtml = emailHtml; }
}