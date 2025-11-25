package com.diedev.firex.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ChatRequestDTO {
    @NotBlank(message = "Message is required")
    private String message;

    private List<ChatMessageDTO> history;

    public ChatRequestDTO() {
    }

    public ChatRequestDTO(String message, List<ChatMessageDTO> history) {
        this.message = message;
        this.history = history;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDTO> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessageDTO> history) {
        this.history = history;
    }
}
