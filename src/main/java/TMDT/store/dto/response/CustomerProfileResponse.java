package TMDT.store.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfileResponse {

    private Integer userId;

    private String fullName;

    private String email;

    private String role;

    private Boolean active;

    private LocalDateTime createdAt;
}