package TMDT.store.dto.response;

import TMDT.store.enums.DeliveryMethod;
import TMDT.store.enums.OrderStatus;
import TMDT.store.enums.PaymentMethod;
import TMDT.store.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderDetailResponse {

    private Integer orderId;

    private Integer userId;

    private String customerName;

    private String phone;

    private String address;

    private String province;

    private String district;

    private String note;

    private DeliveryMethod deliveryMethod;

    private PaymentMethod paymentMethod;

    private BigDecimal subtotal;

    private BigDecimal shippingFee;

    private BigDecimal discountAmount;

    private BigDecimal totalAmount;

    private String voucherCode;

    private OrderStatus status;

    private PaymentStatus paymentStatus;

    private LocalDateTime createdAt;

    private List<AdminOrderItemResponse> items;
}