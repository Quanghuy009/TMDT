package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Integer orderId;

    private String customerName;
    private String phone;
    private String address;
    private String province;
    private String district;
    private String note;

    private String deliveryMethod;
    private String paymentMethod;

    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    private String voucherCode;

    private String status;
    private String paymentStatus;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}