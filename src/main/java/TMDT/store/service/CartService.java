package TMDT.store.service;

import TMDT.store.dto.request.AddToCartRequest;
import TMDT.store.dto.request.UpdateCartItemRequest;
import TMDT.store.dto.response.CartResponse;

public interface CartService {

    CartResponse getMyCart();

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCartItem(Integer cartItemId, UpdateCartItemRequest request);

    CartResponse removeCartItem(Integer cartItemId);
}