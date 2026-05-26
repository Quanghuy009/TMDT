package TMDT.store.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ProductCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findDeviceProductsByCategoryName(String categoryName) {
        String sql = """
            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
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
                ds.utilities,

                active_sale.sale_price

            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN device_specs ds ON p.product_id = ds.product_id
            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id

            WHERE c.category_name = ?
            ORDER BY p.created_at DESC
        """;

        return jdbcTemplate.queryForList(sql, categoryName);
    }

    public List<Map<String, Object>> findAccessoryProducts() {
        String sql = """
            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
                b.brand_name AS brand,
                'headphone' AS sub_type,

                hs.headphone_type,
                hs.jack_type AS connection_type,
                hs.battery_life,
                hs.utilities,

                NULL AS keyboard_type,
                NULL AS layout_value,
                NULL AS switch_type,

                NULL AS speaker_type,
                NULL AS power_value,

                NULL AS mouse_type,
                NULL AS dpi_value,

                active_sale.sale_price

            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN headphone_specs hs ON p.product_id = hs.product_id
            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id

            UNION ALL

            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
                b.brand_name AS brand,
                'keyboard' AS sub_type,

                NULL AS headphone_type,
                ks.wireless_technology AS connection_type,
                NULL AS battery_life,
                ks.utilities,

                ks.keyboard_type,
                ks.keyboard_layout AS layout_value,
                NULL AS switch_type,

                NULL AS speaker_type,
                NULL AS power_value,

                NULL AS mouse_type,
                NULL AS dpi_value,

                active_sale.sale_price

            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN keyboard_specs ks ON p.product_id = ks.product_id
            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id

            UNION ALL

            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
                b.brand_name AS brand,
                'speaker' AS sub_type,

                NULL AS headphone_type,
                sp.wireless_technology AS connection_type,
                sp.battery_life,
                sp.utilities,

                NULL AS keyboard_type,
                NULL AS layout_value,
                NULL AS switch_type,

                sp.speaker_type,
                sp.power_output AS power_value,

                NULL AS mouse_type,
                NULL AS dpi_value,

                active_sale.sale_price

            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN speaker_specs sp ON p.product_id = sp.product_id
            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id

            UNION ALL

            SELECT 
                p.product_id AS id,
                p.product_name AS name,
                p.image,
                p.price,
                b.brand_name AS brand,
                'mouse' AS sub_type,

                NULL AS headphone_type,
                ms.connection_distance AS connection_type,
                NULL AS battery_life,
                ms.special_features AS utilities,

                NULL AS keyboard_type,
                NULL AS layout_value,
                NULL AS switch_type,

                NULL AS speaker_type,
                NULL AS power_value,

                ms.mouse_type,
                NULL AS dpi_value,

                active_sale.sale_price

            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN mouse_specs ms ON p.product_id = ms.product_id
            LEFT JOIN (
                SELECT 
                    fsi.product_id,
                    fsi.sale_price
                FROM flash_sale_items fsi
                JOIN flash_sales fs ON fsi.flash_sale_id = fs.flash_sale_id
                WHERE fs.active = TRUE
                  AND NOW() BETWEEN fs.start_time AND fs.end_time
            ) active_sale ON p.product_id = active_sale.product_id
        """;

        return jdbcTemplate.queryForList(sql);
    }
}