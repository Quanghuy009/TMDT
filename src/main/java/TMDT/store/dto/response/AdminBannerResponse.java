package TMDT.store.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBannerResponse {

    private Long id;

    private String title;

    private String image;

    private Boolean active;
}