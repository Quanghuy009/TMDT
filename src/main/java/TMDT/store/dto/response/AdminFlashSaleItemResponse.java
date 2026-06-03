package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlashSaleItemResponse {

    private Long id;

    private Integer productId;

    private String productName;

    private String image;

    private BigDecimal originalPrice;

    private BigDecimal salePrice;

    private Integer discountPercent;

    private Integer quantityLimit;

    private Integer soldQuantity;
}