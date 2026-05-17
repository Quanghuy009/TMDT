package TMDT.store.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerResponse {

    private Long id;

    private String title;

    private String image;
}
