package co.edu.uis.sistemas.ecommerce.carrito.service.impl;

import co.edu.uis.sistemas.ecommerce.carrito.dtos.ProductDTO;
import co.edu.uis.sistemas.ecommerce.carrito.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class ProductUpdateListener {

    private final ShoppingCartService shoppingCartService; // Usar la interfaz
    private static final Logger LOGGER = LoggerFactory.getLogger(ProductUpdateListener.class);

    public ProductUpdateListener(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @RabbitListener(queues = "${mq.queues.product}") // Usar propiedad para el nombre de la cola
    public void receiveProductUpdate(ProductDTO productRequestDTO) { // Recibir DTO
        LOGGER.info("Product update/addition request received via RabbitMQ: {}", productRequestDTO);
        try {
            shoppingCartService.addProductToCart(productRequestDTO);
            LOGGER.info("Successfully processed product update/addition for user {} product {}", productRequestDTO.userId(), productRequestDTO.id());
        } catch (Exception e) {
            LOGGER.error("Error processing product update/addition from RabbitMQ for user {} product {}: {}",
                    productRequestDTO.userId(), productRequestDTO.id(), e.getMessage(), e);
        }
    }
}
