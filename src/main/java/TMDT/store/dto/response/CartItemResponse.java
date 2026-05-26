package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Integer cartItemId;

    private Integer productId;

    private String productName;

    private String productImage;

    private BigDecimal price;

    private Boolean onSale;

    private BigDecimal salePrice;

    private Integer discountPercent;

    private Integer quantity;

    private BigDecimal subtotal;
}