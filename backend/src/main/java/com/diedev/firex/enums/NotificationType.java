package com.diedev.firex.enums;

public enum NotificationType {
    ORDER_CREATED("orders"),
    ORDER_UPDATED("orders"),
    SERVICE_STATUS_CHANGED("services"),
    LOW_STOCK_ALERT("system"),
    NEW_MESSAGE("system"),
    SYSTEM_ALERT("system"),
    WELCOME("system"),
    MARKETING("marketing");
    
    private final String category;
    
    NotificationType(String category) {
        this.category = category;
    }
    
    public String getCategory() {
        return category;
    }
}
