package TMDT.store.service.impl;

import TMDT.store.dto.request.AdminOrderUpdateRequest;
import TMDT.store.dto.response.AdminOrderDetailResponse;
import TMDT.store.dto.response.AdminOrderItemResponse;
import TMDT.store.dto.response.AdminOrderResponse;
import TMDT.store.entity.Order;
import TMDT.store.entity.OrderItem;
import TMDT.store.repository.OrderRepository;
import TMDT.store.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;

    @Override
    public List<AdminOrderResponse> getAllOrders() {
        return orderRepository.findAllAdminOrders()
                .stream()
                .map(this::toAdminOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderDetailResponse getOrderDetail(Integer orderId) {
        Order order = orderRepository.findAdminOrderDetailById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return toAdminOrderDetailResponse(order);
    }

    @Override
    @Transactional
    public AdminOrderDetailResponse updateOrder(Integer orderId, AdminOrderUpdateRequest request) {
        Order order = orderRepository.findAdminOrderDetailById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        updateBasicInfo(order, request);
        updateOrderStatus(order, request);
        updatePaymentInfo(order, request);
        updateAmountInfo(order, request);

        Order updatedOrder = orderRepository.save(order);

        return toAdminOrderDetailResponse(updatedOrder);
    }

    private void updateBasicInfo(Order order, AdminOrderUpdateRequest request) {
        if (hasText(request.getCustomerName())) {
            order.setCustomerName(request.getCustomerName().trim());
        }

        if (hasText(request.getPhone())) {
            order.setPhone(request.getPhone().trim());
        }

        if (hasText(request.getAddress())) {
            order.setAddress(request.getAddress().trim());
        }

        if (request.getProvince() != null) {
            order.setProvince(normalizeNullableText(request.getProvince()));
        }

        if (request.getDistrict() != null) {
            order.setDistrict(normalizeNullableText(request.getDistrict()));
        }

        if (request.getNote() != null) {
            order.setNote(normalizeNullableText(request.getNote()));
        }

        if (request.getVoucherCode() != null) {
            order.setVoucherCode(normalizeNullableText(request.getVoucherCode()));
        }
    }

    private void updateOrderStatus(Order order, AdminOrderUpdateRequest request) {
        if (request.getDeliveryMethod() != null) {
            order.setDeliveryMethod(request.getDeliveryMethod());
        }

        if (request.getPaymentMethod() != null) {
            order.setPaymentMethod(request.getPaymentMethod());
        }

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }
    }

    private void updatePaymentInfo(Order order, AdminOrderUpdateRequest request) {
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        if (request.getPaymentMethod() != null) {
            order.setPaymentMethod(request.getPaymentMethod());
        }
    }

    private void updateAmountInfo(Order order, AdminOrderUpdateRequest request) {
        if (request.getSubtotal() != null) {
            validateNonNegative(request.getSubtotal(), "Tạm tính không hợp lệ");
            order.setSubtotal(request.getSubtotal());
        }

        if (request.getShippingFee() != null) {
            validateNonNegative(request.getShippingFee(), "Phí vận chuyển không hợp lệ");
            order.setShippingFee(request.getShippingFee());
        }

        if (request.getDiscountAmount() != null) {
            validateNonNegative(request.getDiscountAmount(), "Giảm giá không hợp lệ");
            order.setDiscountAmount(request.getDiscountAmount());
        }

        if (request.getTotalAmount() != null) {
            validateNonNegative(request.getTotalAmount(), "Tổng tiền không hợp lệ");
            order.setTotalAmount(request.getTotalAmount());
        }
    }

    private AdminOrderResponse toAdminOrderResponse(Order order) {
        return AdminOrderResponse.builder()
                .orderId(order.getId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private AdminOrderDetailResponse toAdminOrderDetailResponse(Order order) {
        return AdminOrderDetailResponse.builder()
                .orderId(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .province(order.getProvince())
                .district(order.getDistrict())
                .note(order.getNote())
                .deliveryMethod(order.getDeliveryMethod())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .voucherCode(order.getVoucherCode())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .items(
                        order.getItems() == null
                                ? List.of()
                                : order.getItems()
                                .stream()
                                .map(this::toAdminOrderItemResponse)
                                .toList()
                )
                .build();
    }

    private AdminOrderItemResponse toAdminOrderItemResponse(OrderItem item) {
        return AdminOrderItemResponse.builder()
                .orderItemId(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String normalizeNullableText(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }

    private void validateNonNegative(BigDecimal value, String message) {
        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException(message);
        }
    }
}