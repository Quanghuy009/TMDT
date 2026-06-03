package TMDT.store.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlashSaleDetailResponse {

    private Long id;

    private String name;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean active;

    private Integer priority;

    private String status;

    private List<AdminFlashSaleItemResponse> items;
}