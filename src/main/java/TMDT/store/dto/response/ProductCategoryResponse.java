package TMDT.store.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategoryResponse {

    private String type;

    private String title;

    private List<ProductCategoryItemResponse> products;
}