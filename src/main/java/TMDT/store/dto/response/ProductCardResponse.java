package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCardResponse {

    private Integer id;

    private String name;

    private BigDecimal price;

    private BigDecimal salePrice;

    private Integer discountPercent;

    private Boolean onSale;

    private String image;
}