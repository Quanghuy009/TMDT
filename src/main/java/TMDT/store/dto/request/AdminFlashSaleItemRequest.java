package TMDT.store.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlashSaleItemRequest {

    private Integer productId;

    private BigDecimal salePrice;

    private Integer quantityLimit;

    private Integer soldQuantity;
}