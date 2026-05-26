package TMDT.store.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductDetailRepository {

    private final JdbcTemplate jdbcTemplate;

    public Optional<Map<String, Object>> findProductDetailById(Integer productId) {
        String sql = """
            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
                c.category_name AS category,
                b.brand_name AS brand,

                ds.cpu_chip,
                ds.gpu_chip,
                ds.ram,
                ds.storage_capacity,
                ds.front_camera,
                ds.rear_camera,
                ds.screen_size,
                ds.screen_resolution,
                ds.display_technology,
                ds.battery_capacity,
                ds.charging_power,
                ds.utilities AS device_utilities,

                hs.headphone_type,
                hs.connection_distance AS headphone_connection_distance,
                hs.audio_technology AS headphone_audio_technology,
                hs.compatible_os AS headphone_compatible_os,
                hs.battery_life AS headphone_battery_life,
                hs.jack_type,
                hs.utilities AS headphone_utilities,

                ks.keyboard_type,
                ks.compatible_os AS keyboard_compatible_os,
                ks.connection_distance AS keyboard_connection_distance,
                ks.wireless_technology AS keyboard_wireless_technology,
                ks.keyboard_layout,
                ks.key_count,
                ks.size AS keyboard_size,
                ks.utilities AS keyboard_utilities,

                ms.mouse_type,
                ms.compatible_os AS mouse_compatible_os,
                ms.connection_distance AS mouse_connection_distance,
                ms.battery_type,
                ms.size AS mouse_size,
                ms.special_features,

                sp.speaker_type,
                sp.power_output,
                sp.battery_life AS speaker_battery_life,
                sp.audio_technology AS speaker_audio_technology,
                sp.wireless_technology AS speaker_wireless_technology,
                sp.size AS speaker_size,
                sp.utilities AS speaker_utilities,

                CASE
                    WHEN hs.spec_id IS NOT NULL THEN 'headphone'
                    WHEN ks.spec_id IS NOT NULL THEN 'keyboard'
                    WHEN ms.spec_id IS NOT NULL THEN 'mouse'
                    WHEN sp.spec_id IS NOT NULL THEN 'speaker'
                    ELSE NULL
                END AS sub_type,

                active_sale.sale_price

            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            JOIN brands b ON p.brand_id = b.brand_id

            LEFT JOIN device_specs ds ON p.product_id = ds.product_id
            LEFT JOIN headphone_specs hs ON p.product_id = hs.product_id
            LEFT JOIN keyboard_specs ks ON p.product_id = ks.product_id
            LEFT JOIN mouse_specs ms ON p.product_id = ms.product_id
            LEFT JOIN speaker_specs sp ON p.product_id = sp.product_id

            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id

            WHERE p.product_id = ?
        """;

        var rows = jdbcTemplate.queryForList(sql, productId);

        if (rows.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(rows.get(0));
    }
}