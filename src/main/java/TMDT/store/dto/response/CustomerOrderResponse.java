package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrderResponse {

    private Integer orderId;

    private LocalDateTime createdAt;

    private BigDecimal totalAmount;

    private String status;

    private String paymentMethod;

    private String paymentStatus;
}