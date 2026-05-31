package TMDT.store.dto.response;

import TMDT.store.enums.OrderStatus;
import TMDT.store.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderResponse {

    private Integer orderId;

    private String customerName;

    private String phone;

    private String address;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private LocalDateTime createdAt;
}