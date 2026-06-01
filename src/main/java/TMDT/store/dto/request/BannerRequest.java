package TMDT.store.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerRequest {

    private String title;

    private String image;

    private Boolean active;
}