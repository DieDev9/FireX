package com.diedev.firex.service.interfaces;


import com.diedev.firex.dto.request.ChatRequestDTO;
import com.diedev.firex.dto.response.ChatResponseDTO;

public interface ChatbotService {
    ChatResponseDTO sendMessage(ChatRequestDTO request);
}
