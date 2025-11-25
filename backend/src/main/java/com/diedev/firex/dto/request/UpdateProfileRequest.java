package com.diedev.firex.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO específico para actualizar perfil de usuario
 * Solo el nombre es requerido, los demás campos son opcionales
 */
public class UpdateProfileRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    // Campos opcionales (sin validación @NotBlank)
    private String phone;

    private String address;

    // Contraseña opcional (si se envía, se actualiza)
    private String password;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}