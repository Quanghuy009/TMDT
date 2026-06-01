package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminHomepageProductResponse {

    private Long id;

    private Integer productId;

    private String productName;

    private String image;

    private String categoryName;

    private String brandName;

    private BigDecimal price;
}