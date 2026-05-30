package TMDT.store.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCategoryResponse {

    private Integer categoryId;

    private String categoryName;

    private Long productCount;
}