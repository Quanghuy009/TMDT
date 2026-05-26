package TMDT.store.mapper;

import TMDT.store.dto.response.CartItemResponse;
import TMDT.store.dto.response.CartResponse;
import TMDT.store.entity.Cart;
import TMDT.store.entity.CartItem;
import TMDT.store.entity.Product;
import TMDT.store.service.ProductPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CartMapper {

    private final ProductPriceService productPriceService;

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(this::toCartItemResponse)
                .toList();

        Integer totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();

        BigDecimal originalPrice = product.getPrice();
        BigDecimal salePrice = productPriceService.getActiveSalePrice(product);

        boolean onSale = salePrice != null
                && salePrice.compareTo(originalPrice) < 0;

        BigDecimal finalPrice = onSale ? salePrice : originalPrice;

        BigDecimal subtotal = finalPrice.multiply(
                BigDecimal.valueOf(cartItem.getQuantity())
        );

        Integer discountPercent = productPriceService.calculateDiscountPercent(
                originalPrice,
                salePrice
        );

        return CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImage())
                .price(originalPrice)
                .onSale(onSale)
                .salePrice(onSale ? salePrice : null)
                .discountPercent(discountPercent)
                .quantity(cartItem.getQuantity())
                .subtotal(subtotal)
                .build();
    }
}