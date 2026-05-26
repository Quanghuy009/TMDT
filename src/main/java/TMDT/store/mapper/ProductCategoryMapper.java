package TMDT.store.mapper;

import TMDT.store.dto.response.ProductCategoryItemResponse;
import TMDT.store.util.NumberUtil;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Component
public class ProductCategoryMapper {

    public ProductCategoryItemResponse toDeviceProductResponse(
            Map<String, Object> row,
            String categoryType
    ) {
        BigDecimal price = NumberUtil.toBigDecimal(row.get("price"));
        BigDecimal salePrice = NumberUtil.toBigDecimal(row.get("sale_price"));

        Map<String, Object> specs = new HashMap<>();

        specs.put("cpu_chip", row.get("cpu_chip"));
        specs.put("gpu_chip", row.get("gpu_chip"));
        specs.put("ram", row.get("ram"));
        specs.put("storage_capacity", row.get("storage_capacity"));
        specs.put("front_camera", row.get("front_camera"));
        specs.put("rear_camera", row.get("rear_camera"));
        specs.put("screen_size", row.get("screen_size"));
        specs.put("screen_resolution", row.get("screen_resolution"));
        specs.put("display_technology", row.get("display_technology"));
        specs.put("battery_capacity", row.get("battery_capacity"));
        specs.put("charging_power", row.get("charging_power"));
        specs.put("utilities", row.get("utilities"));

        ProductCategoryItemResponse response = ProductCategoryItemResponse.builder()
                .id(NumberUtil.toInteger(row.get("id")))
                .name((String) row.get("name"))
                .image((String) row.get("image"))
                .price(price)
                .category(categoryType)
                .brand((String) row.get("brand"))
                .subType(null)
                .specs(specs)
                .build();

        applySaleInfo(response, price, salePrice);

        return response;
    }

    public ProductCategoryItemResponse toAccessoryProductResponse(Map<String, Object> row) {
        BigDecimal price = NumberUtil.toBigDecimal(row.get("price"));
        BigDecimal salePrice = NumberUtil.toBigDecimal(row.get("sale_price"));
        String subType = (String) row.get("sub_type");

        Map<String, Object> specs = new HashMap<>();

        switch (subType) {
            case "headphone" -> {
                specs.put("connection_type", row.get("connection_type"));
                specs.put("headphone_type", row.get("headphone_type"));
                specs.put("battery_life", row.get("battery_life"));
                specs.put("utilities", row.get("utilities"));
            }

            case "keyboard" -> {
                specs.put("connection_type", row.get("connection_type"));
                specs.put("keyboard_type", row.get("keyboard_type"));
                specs.put("layout", row.get("layout_value"));
                specs.put("switch_type", row.get("switch_type"));
                specs.put("utilities", row.get("utilities"));
            }

            case "speaker" -> {
                specs.put("connection_type", row.get("connection_type"));
                specs.put("speaker_type", row.get("speaker_type"));
                specs.put("power", row.get("power_value"));
                specs.put("battery_life", row.get("battery_life"));
                specs.put("utilities", row.get("utilities"));
            }

            case "mouse" -> {
                specs.put("connection_type", row.get("connection_type"));
                specs.put("mouse_type", row.get("mouse_type"));
                specs.put("dpi", row.get("dpi_value"));
                specs.put("utilities", row.get("utilities"));
            }

            default -> {
            }
        }

        ProductCategoryItemResponse response = ProductCategoryItemResponse.builder()
                .id(NumberUtil.toInteger(row.get("id")))
                .name((String) row.get("name"))
                .image((String) row.get("image"))
                .price(price)
                .category("accessory")
                .brand((String) row.get("brand"))
                .subType(subType)
                .specs(specs)
                .build();

        applySaleInfo(response, price, salePrice);

        return response;
    }

    private void applySaleInfo(
            ProductCategoryItemResponse response,
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