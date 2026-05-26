package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategoryItemResponse {

    private Integer id;

    private String name;

    private String image;

    private BigDecimal price;

    private Boolean onSale;

    private BigDecimal salePrice;

    private Integer discountPercent;

    private String category;

    private String brand;

    private String subType;

    private Map<String, Object> specs;
}