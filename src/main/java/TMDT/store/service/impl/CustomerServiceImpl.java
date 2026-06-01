package TMDT.store.service.impl;

import TMDT.store.dto.request.UpdateCustomerProfileRequest;
import TMDT.store.dto.response.AdminCustomerResponse;
import TMDT.store.dto.response.CustomerOrderDetailResponse;
import TMDT.store.dto.response.CustomerOrderItemResponse;
import TMDT.store.dto.response.CustomerOrderResponse;
import TMDT.store.dto.response.CustomerProfileResponse;
import TMDT.store.entity.Order;
import TMDT.store.entity.OrderItem;
import TMDT.store.entity.User;
import TMDT.store.repository.OrderRepository;
import TMDT.store.repository.UserRepository;
import TMDT.store.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;


    // ===== Admin customer management =====

    @Override
    public List<AdminCustomerResponse> getAllAdminCustomers() {
        return userRepository.findAllAdminCustomers();
    }

    @Override
    @Transactional
    public AdminCustomerResponse toggleCustomerActive(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        Boolean currentActive = user.getActive();

        user.setActive(currentActive == null || !currentActive);

        userRepository.save(user);

        return userRepository.findAdminCustomerById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng sau khi cập nhật"));
    }


    // ===== Customer account page =====

    @Override
    public CustomerProfileResponse getProfile() {
        User user = getCurrentUser();

        return toProfileResponse(user);
    }

    @Override
    @Transactional
    public CustomerProfileResponse updateProfile(UpdateCustomerProfileRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Họ tên không được để trống");
        }

        user.setFullName(request.getFullName().trim());

        User savedUser = userRepository.save(user);

        return toProfileResponse(savedUser);
    }

    @Override
    public List<CustomerOrderResponse> getMyOrders() {
        User user = getCurrentUser();

        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Override
    public CustomerOrderDetailResponse getMyOrderDetail(Integer orderId) {
        User user = getCurrentUser();

        Order order = orderRepository.findByIdAndUserWithItems(orderId, user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return toOrderDetailResponse(order);
    }


    // ===== Current user =====

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }

        String email = principal.toString();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }


    // ===== Mapper =====

    private CustomerProfileResponse toProfileResponse(User user) {
        return CustomerProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private CustomerOrderResponse toOrderResponse(Order order) {
        return CustomerOrderResponse.builder()
                .orderId(order.getId())
                .createdAt(order.getCreatedAt())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)
                .build();
    }

    private CustomerOrderDetailResponse toOrderDetailResponse(Order order) {
        List<CustomerOrderItemResponse> items = order.getItems()
                .stream()
                .map(this::toOrderItemResponse)
                .toList();

        return CustomerOrderDetailResponse.builder()
                .orderId(order.getId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .province(order.getProvince())
                .district(order.getDistrict())
                .note(order.getNote())
                .deliveryMethod(order.getDeliveryMethod() != null ? order.getDeliveryMethod().name() : null)
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .paymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }

    private CustomerOrderItemResponse toOrderItemResponse(OrderItem item) {
        return CustomerOrderItemResponse.builder()
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}