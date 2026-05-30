package TMDT.store.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductRequest {

    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String image;

    private Integer categoryId;
    private Integer brandId;

    private String accessoryType;

    private DeviceSpecRequest deviceSpec;
    private HeadphoneSpecRequest headphoneSpec;
    private KeyboardSpecRequest keyboardSpec;
    private MouseSpecRequest mouseSpec;
    private SpeakerSpecRequest speakerSpec;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceSpecRequest {
        private String cpuChip;
        private String gpuChip;
        private String ram;
        private String storageCapacity;
        private String frontCamera;
        private String rearCamera;
        private String screenSize;
        private String screenResolution;
        private String displayTechnology;
        private String batteryCapacity;
        private String chargingPower;
        private String utilities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeadphoneSpecRequest {
        private String headphoneType;
        private String connectionDistance;
        private String audioTechnology;
        private String compatibleOs;
        private String batteryLife;
        private String jackType;
        private String utilities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeyboardSpecRequest {
        private String keyboardType;
        private String compatibleOs;
        private String connectionDistance;
        private String wirelessTechnology;
        private String keyboardLayout;
        private Integer keyCount;
        private String size;
        private String utilities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MouseSpecRequest {
        private String mouseType;
        private String compatibleOs;
        private String connectionDistance;
        private String batteryType;
        private String size;
        private String specialFeatures;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpeakerSpecRequest {
        private String speakerType;
        private String powerOutput;
        private String batteryLife;
        private String audioTechnology;
        private String wirelessTechnology;
        private String size;
        private String utilities;
    }
}