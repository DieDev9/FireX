package com.diedev.firex.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageDTO {
    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Content is required")
    private String content;

    public ChatMessageDTO() {
    }

    public ChatMessageDTO(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
