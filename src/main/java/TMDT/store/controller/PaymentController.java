package TMDT.store.controller;

import TMDT.store.dto.request.CreatePaymentRequest;
import TMDT.store.dto.response.PaymentResponse;
import TMDT.store.entity.Order;
import TMDT.store.entity.User;
import TMDT.store.enums.PaymentStatus;
import TMDT.store.repository.OrderRepository;
import TMDT.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest request,
            Authentication authentication
    ) throws Exception {

        User currentUser = getCurrentUser(authentication);

        if (request.getOrderId() == null) {
            throw new RuntimeException("Thiếu mã đơn hàng");
        }

        Order order = orderRepository.findByIdAndUser(request.getOrderId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Đơn hàng đã được thanh toán");
        }

        Long amount = toPayosAmount(order.getTotalAmount());

        PayOS payOS = new PayOS(clientId, apiKey, checksumKey);

        CreatePaymentLinkRequest paymentRequest = CreatePaymentLinkRequest.builder()
                .orderCode(order.getId().longValue())
                .amount(amount)
                .description("DH" + order.getId())
                .returnUrl(frontendUrl + "/pages/payment-success.html?orderId=" + order.getId())
                .cancelUrl(frontendUrl + "/pages/payment-cancel.html?orderId=" + order.getId())
                .build();

        var paymentLink = payOS.paymentRequests().create(paymentRequest);

        return ResponseEntity.ok(new PaymentResponse(paymentLink.getCheckoutUrl()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> webhookBody) {
        System.out.println("===== PAYOS WEBHOOK CALLED =====");
        System.out.println("WEBHOOK BODY = " + webhookBody);

        try {
            PayOS payOS = new PayOS(clientId, apiKey, checksumKey);

            var data = payOS.webhooks().verify(webhookBody);

            Long orderCode = data.getOrderCode();

            System.out.println("PAYOS ORDER CODE = " + orderCode);

            Order order = orderRepository.findById(orderCode.intValue())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

            order.setPaymentStatus(PaymentStatus.PAID);

            // Nếu muốn tự động xác nhận đơn sau khi thanh toán, mở dòng này:
            // order.setStatus(OrderStatus.CONFIRMED);

            orderRepository.save(order);

            System.out.println("ORDER PAYMENT UPDATED TO PAID: " + order.getId());

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid webhook");
        }
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }

        if (principal instanceof String email) {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        }

        throw new RuntimeException("Thông tin đăng nhập không hợp lệ");
    }

    private Long toPayosAmount(BigDecimal totalAmount) {
        if (totalAmount == null) {
            throw new RuntimeException("Tổng tiền đơn hàng không hợp lệ");
        }

        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Tổng tiền đơn hàng phải lớn hơn 0");
        }

        return totalAmount.longValueExact();
    }
}