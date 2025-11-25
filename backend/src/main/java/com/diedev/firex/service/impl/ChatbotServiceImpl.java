package com.diedev.firex.service.impl;


import com.diedev.firex.dto.request.ChatMessageDTO;
import com.diedev.firex.dto.request.ChatRequestDTO;
import com.diedev.firex.dto.response.ChatResponseDTO;
import com.diedev.firex.service.interfaces.ChatbotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotServiceImpl.class);

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.model}")
    private String model;

    private static final String SYSTEM_INSTRUCTION = 
        "Eres un asistente virtual para FireX, una empresa de productos industriales. " +
        "Tu trabajo es ayudar a los clientes con información sobre productos, servicios y soporte general. " +
        "Sé amable, profesional y conciso en tus respuestas. " +
        "Si no sabes algo, admítelo y sugiere contactar con el equipo de soporte.";

    private final RestTemplate restTemplate;

    public ChatbotServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public ChatResponseDTO sendMessage(ChatRequestDTO request) {
        try {
            if (apiKey == null || apiKey.equals("your-openrouter-api-key-here")) {
                logger.error("OpenRouter API Key not configured");
                return new ChatResponseDTO(
                    "Error de configuración: API Key no encontrada.",
                    false,
                    "API Key missing"
                );
            }

            logger.info("Sending message to OpenRouter API: {}", request.getMessage());

            List<Map<String, String>> messages = buildMessages(request);
            Map<String, Object> requestBody = buildRequestBody(messages);
            HttpHeaders headers = buildHeaders();
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                Map.class
            );

            return processResponse(response);

        } catch (Exception e) {
            logger.error("Error calling OpenRouter API", e);
            return new ChatResponseDTO(
                "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
                false,
                e.getMessage()
            );
        }
    }

    private List<Map<String, String>> buildMessages(ChatRequestDTO request) {
        List<Map<String, String>> messages = new ArrayList<>();
        
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", SYSTEM_INSTRUCTION);
        messages.add(systemMessage);

        if (request.getHistory() != null && !request.getHistory().isEmpty()) {
            for (ChatMessageDTO msg : request.getHistory()) {
                Map<String, String> historyMessage = new HashMap<>();
                historyMessage.put("role", msg.getRole());
                historyMessage.put("content", msg.getContent());
                messages.add(historyMessage);
            }
        }

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", request.getMessage());
        messages.add(userMessage);

        return messages;
    }

    private Map<String, Object> buildRequestBody(List<Map<String, String>> messages) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);
        return requestBody;
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("HTTP-Referer", "https://firex.app");
        headers.set("X-Title", "FireX Chatbot");
        return headers;
    }

    @SuppressWarnings("unchecked")
    private ChatResponseDTO processResponse(ResponseEntity<Map> response) {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, String> message = (Map<String, String>) firstChoice.get("message");
                String content = message.get("content");
                
                logger.info("Received response from OpenRouter API");
                return new ChatResponseDTO(content, true);
            }
        }

        logger.error("Unexpected response format from OpenRouter API");
        return new ChatResponseDTO(
            "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
            false,
            "Unexpected response format"
        );
    }
}
