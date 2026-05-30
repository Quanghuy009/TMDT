package TMDT.store.dto.response;

import TMDT.store.dto.request.AdminProductRequest;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductDetailResponse {

    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String image;

    private Integer categoryId;
    private String categoryName;

    private Integer brandId;
    private String brandName;

    private String accessoryType;

    private AdminProductRequest.DeviceSpecRequest deviceSpec;
    private AdminProductRequest.HeadphoneSpecRequest headphoneSpec;
    private AdminProductRequest.KeyboardSpecRequest keyboardSpec;
    private AdminProductRequest.MouseSpecRequest mouseSpec;
    private AdminProductRequest.SpeakerSpecRequest speakerSpec;
}