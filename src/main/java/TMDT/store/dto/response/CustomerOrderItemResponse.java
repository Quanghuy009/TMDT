package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrderItemResponse {

    private Integer productId;

    private String productName;

    private String productImage;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;
}