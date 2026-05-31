package TMDT.store.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCustomerResponse {

    private Integer userId;

    private String fullName;

    private String email;

    private String role;

    private Boolean active;

    private Long orderCount;

    private LocalDateTime createdAt;
}