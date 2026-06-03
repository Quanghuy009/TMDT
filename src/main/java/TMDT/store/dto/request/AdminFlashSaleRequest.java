package TMDT.store.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlashSaleRequest {

    private String name;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean active;

    private Integer priority;
}