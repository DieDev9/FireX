package com.diedev.firex.service.interfaces;

import com.diedev.firex.dto.request.ProductRequest;
import com.diedev.firex.dto.response.ProductResponse;

import java.util.List;

public interface IProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(String id);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(String id, ProductRequest request);
    void deleteProduct(String id);
    List<ProductResponse> getProductsByCategory(String categoryId);
    List<ProductResponse> searchProducts(String keyword);
    List<ProductResponse> getAvailableProducts();
    List<ProductResponse> getLowStockProducts(int threshold);
}