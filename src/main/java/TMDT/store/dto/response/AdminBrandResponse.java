package TMDT.store.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBrandResponse {

    private Integer brandId;

    private String brandName;

    private String country;

    private Long productCount;
}