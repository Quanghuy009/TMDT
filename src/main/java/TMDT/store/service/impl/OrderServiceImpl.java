package TMDT.store.service.impl;

import TMDT.store.dto.request.CreateOrderRequest;
import TMDT.store.dto.response.OrderItemResponse;
import TMDT.store.dto.response.OrderResponse;
import TMDT.store.entity.*;
import TMDT.store.enums.DeliveryMethod;
import TMDT.store.enums.OrderStatus;
import TMDT.store.enums.PaymentMethod;
import TMDT.store.enums.PaymentStatus;
import TMDT.store.repository.CartRepository;
import TMDT.store.repository.OrderRepository;
import TMDT.store.repository.ProductRepository;
import TMDT.store.repository.UserRepository;
import TMDT.store.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống");
        }

        validateRequest(request);

        BigDecimal subtotal = calculateSubtotal(cart);

        BigDecimal shippingFee = BigDecimal.ZERO;

        // Giai đoạn 1 chưa xử lý voucher
        BigDecimal discountAmount = BigDecimal.ZERO;
        String voucherCode = null;

        BigDecimal totalAmount = subtotal
                .add(shippingFee)
                .subtract(discountAmount);

        Order order = Order.builder()
                .user(user)
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .province(request.getProvince())
                .district(request.getDistrict())
                .note(request.getNote())

                .deliveryMethod(DeliveryMethod.HOME_DELIVERY)
                .paymentMethod(PaymentMethod.COD)

                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .voucherCode(voucherCode)

                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng tồn kho");
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getImage())
                    .unitPrice(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .totalPrice(totalPrice)
                    .build();

            order.getItems().add(orderItem);

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderDetail(Integer orderId) {
        User user = getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }

        return mapToResponse(order);
    }

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        }

        throw new RuntimeException("Không lấy được thông tin người dùng hiện tại");
    }

    private void validateRequest(CreateOrderRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập họ tên");
        }

        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập số điện thoại");
        }

        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập địa chỉ nhận hàng");
        }
    }

    private BigDecimal calculateSubtotal(Cart cart) {
        return cart.getItems()
                .stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getPrice();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .unitPrice(item.getUnitPrice())
                        .quantity(item.getQuantity())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())

                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .province(order.getProvince())
                .district(order.getDistrict())
                .note(order.getNote())

                .deliveryMethod(order.getDeliveryMethod().name())
                .paymentMethod(order.getPaymentMethod().name())

                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .voucherCode(order.getVoucherCode())

                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())

                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}