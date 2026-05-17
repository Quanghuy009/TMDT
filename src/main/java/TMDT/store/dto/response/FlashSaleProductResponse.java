package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleProductResponse {

    private Integer id;

    private String name;

    private BigDecimal price;

    private BigDecimal salePrice;

    private Integer discountPercent;

    private Integer quantityLimit;

    private Integer soldQuantity;

    private Integer soldPercent;

    private String image;
}