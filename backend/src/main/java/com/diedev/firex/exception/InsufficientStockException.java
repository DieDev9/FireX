package com.diedev.firex.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(String productName, int requested, int available) {
        super(String.format("Stock insuficiente para '%s'. Solicitado: %d, Disponible: %d",
                productName, requested, available));
    }
}

