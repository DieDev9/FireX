package com.diedev.firex.util;

import com.diedev.firex.exception.BadRequestException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class ValidationUtils {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Validar que una fecha no sea pasada
     */
    public static void validateFutureDate(String fecha) {
        try {
            LocalDate date = LocalDate.parse(fecha, DATE_FORMATTER);
            if (date.isBefore(LocalDate.now())) {
                throw new BadRequestException("La fecha no puede ser en el pasado");
            }
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Formato de fecha inválido. Use YYYY-MM-DD");
        }
    }

    /**
     * Validar email formato básico
     */
    public static void validateEmail(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new BadRequestException("Email inválido");
        }
    }

    /**
     * Validar teléfono colombiano
     */
    public static void validateColombianPhone(String phone) {
        if (phone == null || !phone.matches("^3[0-9]{9}$")) {
            throw new BadRequestException("Teléfono inválido. Debe ser un celular colombiano de 10 dígitos");
        }
    }
}