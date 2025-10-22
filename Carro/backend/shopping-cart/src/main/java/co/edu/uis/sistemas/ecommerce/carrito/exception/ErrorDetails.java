package co.edu.uis.sistemas.ecommerce.carrito.exception;

import lombok.Getter;

import java.util.Date;

@Getter
public class ErrorDetails {
    // Getters
    private final Date timestamp;
    private final String message;
    private final String details;

    public ErrorDetails(Date timestamp, String message, String details) {
        super();
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

}
