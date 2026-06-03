package TMDT.store.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageSectionResponse {

    private Long id;

    private String code;

    private String name;

    private Boolean active;
}