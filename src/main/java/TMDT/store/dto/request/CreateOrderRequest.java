package TMDT.store.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    private String customerName;
    private String phone;
    private String address;
    private String province;
    private String district;
    private String note;

    // Giai đoạn 1 mặc định HOME_DELIVERY
    private String deliveryMethod;

    // Giai đoạn 1 mặc định COD
    private String paymentMethod;

    // Giai đoạn 1 chưa dùng, nhưng để sẵn
    private String voucherCode;
}