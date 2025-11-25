package com.diedev.firex.controllers;


import com.diedev.firex.dto.request.ChatRequestDTO;
import com.diedev.firex.dto.response.ChatResponseDTO;
import com.diedev.firex.service.interfaces.ChatbotService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> sendMessage(@Valid @RequestBody ChatRequestDTO request) {
        logger.info("Received chat request with message: {}", request.getMessage());
        
        try {
            ChatResponseDTO response = chatbotService.sendMessage(request);
            logger.info("Chat response success: {}", response.isSuccess());
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                logger.error("Chat service returned error: {}", response.getError());
                return ResponseEntity.internalServerError().body(response);
            }
        } catch (Exception e) {
            logger.error("Exception in chat controller", e);
            ChatResponseDTO errorResponse = new ChatResponseDTO(
                "Error al procesar la solicitud",
                false,
                e.getMessage()
            );
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
