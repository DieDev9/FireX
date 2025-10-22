package co.edu.uis.sistemas.ecommerce.carrito.mapper;

import co.edu.uis.sistemas.ecommerce.carrito.dtos.ProductDTO;
import co.edu.uis.sistemas.ecommerce.carrito.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 *
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {
    // Instancia del mapeador usado para inyectarlo al proyecto
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    /**
     * Convierte un modelo producto a su DTO de respuesta.
     * @param product instancia del producto a convertir
     * @return un DTO convertido
     */
    ProductDTO productToProductDTO(Product product);

    /**
     * Convierte un DTO de producto request a su modelo
     * @param productDTO instancia del DTO a convertir
     * @return una nueva instancia del modelo
     */
    Product productDTOToProduct(ProductDTO productDTO);

    /**
     * Convierten una lista de modelos a sus DTO de respuesta.
     * @param products lista de instancias de productos a convertir
     * @return una lista de DTOs convertidos
     */
    List<ProductDTO> productsToProductDTOs(List<Product> products);

    /**
     * Convierte una lista de DTO de productos request a una lita de sus modelos
     * @param productDTOs lista de instancias de los DTOs a convertir
     * @return Una nueva lista de instancias del modelo
     */
    List<Product> productDTOsToProducts(List<ProductDTO> productDTOs);
}
