package com.diedev.firex.service.interfaces;

import com.diedev.firex.dto.request.CartItemRequest;
import com.diedev.firex.dto.response.CartResponse;

public interface ICartService {
    CartResponse getCartByUserId(String userId);
    CartResponse addOrUpdateItem(String userId, CartItemRequest request);
    CartResponse removeItem(String userId, String productId);
    void clearCart(String userId);
}