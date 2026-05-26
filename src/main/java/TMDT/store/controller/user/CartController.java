package TMDT.store.controller.user;

import TMDT.store.dto.request.AddToCartRequest;
import TMDT.store.dto.request.UpdateCartItemRequest;
import TMDT.store.dto.response.CartResponse;
import TMDT.store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getMyCart() {
        return cartService.getMyCart();
    }

    @PostMapping("/items")
    public CartResponse addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addToCart(request);
    }

    @PutMapping("/items/{cartItemId}")
    public CartResponse updateCartItem(
            @PathVariable Integer cartItemId,
            @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateCartItem(cartItemId, request);
    }

    @DeleteMapping("/items/{cartItemId}")
    public CartResponse removeCartItem(@PathVariable Integer cartItemId) {
        return cartService.removeCartItem(cartItemId);
    }
}