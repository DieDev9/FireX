package com.diedev.firex.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notification_preferences")
public class NotificationPreferences {

    @Id
    private String id;

    private String userId;
    
    // Canales
    private Boolean emailEnabled = true;
    private Boolean pushEnabled = true;
    
    // Categorías
    private Boolean orderNotifications = true;
    private Boolean serviceNotifications = true;
    private Boolean marketingNotifications = false;
    private Boolean systemNotifications = true;
    
    private LocalDateTime updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Boolean getEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(Boolean emailEnabled) { this.emailEnabled = emailEnabled; }

    public Boolean getPushEnabled() { return pushEnabled; }
    public void setPushEnabled(Boolean pushEnabled) { this.pushEnabled = pushEnabled; }

    public Boolean getOrderNotifications() { return orderNotifications; }
    public void setOrderNotifications(Boolean orderNotifications) { this.orderNotifications = orderNotifications; }

    public Boolean getServiceNotifications() { return serviceNotifications; }
    public void setServiceNotifications(Boolean serviceNotifications) { this.serviceNotifications = serviceNotifications; }

    public Boolean getMarketingNotifications() { return marketingNotifications; }
    public void setMarketingNotifications(Boolean marketingNotifications) { this.marketingNotifications = marketingNotifications; }

    public Boolean getSystemNotifications() { return systemNotifications; }
    public void setSystemNotifications(Boolean systemNotifications) { this.systemNotifications = systemNotifications; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
