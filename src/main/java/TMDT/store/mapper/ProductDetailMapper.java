package TMDT.store.mapper;

import TMDT.store.dto.response.ProductDetailResponse;
import TMDT.store.util.NumberUtil;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class ProductDetailMapper {

    public ProductDetailResponse toProductDetailResponse(Map<String, Object> row) {
        BigDecimal price = NumberUtil.toBigDecimal(row.get("price"));
        BigDecimal salePrice = NumberUtil.toBigDecimal(row.get("sale_price"));

        String category = (String) row.get("category");
        String subType = (String) row.get("sub_type");

        Map<String, Object> specs = buildSpecs(row, category, subType);

        ProductDetailResponse response = ProductDetailResponse.builder()
                .id(NumberUtil.toInteger(row.get("id")))
                .name((String) row.get("name"))
                .image((String) row.get("image"))
                .price(price)
                .category(category)
                .brand((String) row.get("brand"))
                .subType(subType)
                .specs(specs)
                .build();

        applySaleInfo(response, price, salePrice);

        return response;
    }

    private Map<String, Object> buildSpecs(
            Map<String, Object> row,
            String category,
            String subType
    ) {
        Map<String, Object> specs = new LinkedHashMap<>();

        if ("Điện thoại".equalsIgnoreCase(category)
                || "Laptop".equalsIgnoreCase(category)
                || "Tablet".equalsIgnoreCase(category)) {

            putIfNotNull(specs, "cpu_chip", row.get("cpu_chip"));
            putIfNotNull(specs, "gpu_chip", row.get("gpu_chip"));
            putIfNotNull(specs, "ram", row.get("ram"));
            putIfNotNull(specs, "storage_capacity", row.get("storage_capacity"));
            putIfNotNull(specs, "front_camera", row.get("front_camera"));
            putIfNotNull(specs, "rear_camera", row.get("rear_camera"));
            putIfNotNull(specs, "screen_size", row.get("screen_size"));
            putIfNotNull(specs, "screen_resolution", row.get("screen_resolution"));
            putIfNotNull(specs, "display_technology", row.get("display_technology"));
            putIfNotNull(specs, "battery_capacity", row.get("battery_capacity"));
            putIfNotNull(specs, "charging_power", row.get("charging_power"));
            putIfNotNull(specs, "utilities", row.get("device_utilities"));

            return specs;
        }

        if ("headphone".equals(subType)) {
            putIfNotNull(specs, "headphone_type", row.get("headphone_type"));
            putIfNotNull(specs, "connection_distance", row.get("headphone_connection_distance"));
            putIfNotNull(specs, "audio_technology", row.get("headphone_audio_technology"));
            putIfNotNull(specs, "compatible_os", row.get("headphone_compatible_os"));
            putIfNotNull(specs, "battery_life", row.get("headphone_battery_life"));
            putIfNotNull(specs, "jack_type", row.get("jack_type"));
            putIfNotNull(specs, "utilities", row.get("headphone_utilities"));
        }

        if ("keyboard".equals(subType)) {
            putIfNotNull(specs, "keyboard_type", row.get("keyboard_type"));
            putIfNotNull(specs, "compatible_os", row.get("keyboard_compatible_os"));
            putIfNotNull(specs, "connection_distance", row.get("keyboard_connection_distance"));
            putIfNotNull(specs, "wireless_technology", row.get("keyboard_wireless_technology"));
            putIfNotNull(specs, "keyboard_layout", row.get("keyboard_layout"));
            putIfNotNull(specs, "key_count", row.get("key_count"));
            putIfNotNull(specs, "size", row.get("keyboard_size"));
            putIfNotNull(specs, "utilities", row.get("keyboard_utilities"));
        }

        if ("mouse".equals(subType)) {
            putIfNotNull(specs, "mouse_type", row.get("mouse_type"));
            putIfNotNull(specs, "compatible_os", row.get("mouse_compatible_os"));
            putIfNotNull(specs, "connection_distance", row.get("mouse_connection_distance"));
            putIfNotNull(specs, "battery_type", row.get("battery_type"));
            putIfNotNull(specs, "size", row.get("mouse_size"));
            putIfNotNull(specs, "special_features", row.get("special_features"));
        }

        if ("speaker".equals(subType)) {
            putIfNotNull(specs, "speaker_type", row.get("speaker_type"));
            putIfNotNull(specs, "power_output", row.get("power_output"));
            putIfNotNull(specs, "battery_life", row.get("speaker_battery_life"));
            putIfNotNull(specs, "audio_technology", row.get("speaker_audio_technology"));
            putIfNotNull(specs, "wireless_technology", row.get("speaker_wireless_technology"));
            putIfNotNull(specs, "size", row.get("speaker_size"));
            putIfNotNull(specs, "utilities", row.get("speaker_utilities"));
        }

        return specs;
    }

    private void putIfNotNull(Map<String, Object> specs, String key, Object value) {
        if (value != null && !value.toString().isBlank()) {
            specs.put(key, value);
        }
    }

    private void applySaleInfo(
            ProductDetailResponse response,
            BigDecimal price,
            BigDecimal salePrice
    ) {
        if (price != null && salePrice != null && salePrice.compareTo(price) < 0) {
            response.setOnSale(true);
            response.setSalePrice(salePrice);

            BigDecimal discountPercent = price.subtract(salePrice)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(price, 0, RoundingMode.HALF_UP);

            response.setDiscountPercent(discountPercent.intValue());
        } else {
            response.setOnSale(false);
            response.setSalePrice(null);
            response.setDiscountPercent(0);
        }
    }
}