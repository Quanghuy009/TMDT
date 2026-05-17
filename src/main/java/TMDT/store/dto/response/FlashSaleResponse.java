package TMDT.store.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleResponse {

    private Long id;

    private String name;

    private LocalDateTime endTime;

    private List<FlashSaleProductResponse> products;
}