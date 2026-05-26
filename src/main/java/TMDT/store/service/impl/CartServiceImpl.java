package TMDT.store.service.impl;

import TMDT.store.dto.request.AddToCartRequest;
import TMDT.store.dto.request.UpdateCartItemRequest;
import TMDT.store.dto.response.CartResponse;
import TMDT.store.entity.Cart;
import TMDT.store.entity.CartItem;
import TMDT.store.entity.Product;
import TMDT.store.entity.User;
import TMDT.store.exception.BadRequestException;
import TMDT.store.mapper.CartMapper;
import TMDT.store.repository.CartItemRepository;
import TMDT.store.repository.CartRepository;
import TMDT.store.repository.ProductRepository;
import TMDT.store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final CartMapper cartMapper;

    @Override
    public CartResponse getMyCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy sản phẩm"));

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(1)
                    .build();

            cart.getItems().add(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + 1);
        }

        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(
            Integer cartItemId,
            UpdateCartItemRequest request
    ) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy sản phẩm trong giỏ"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Bạn không có quyền sửa sản phẩm này");
        }

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new BadRequestException("Số lượng không hợp lệ");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(Integer cartItemId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy sản phẩm trong giỏ"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa sản phẩm này");
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        return cartMapper.toCartResponse(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof User user)) {
            throw new BadRequestException("Bạn cần đăng nhập");
        }

        return user;
    }
}