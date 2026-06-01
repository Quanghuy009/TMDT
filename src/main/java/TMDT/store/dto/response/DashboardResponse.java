package TMDT.store.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private BigDecimal completedRevenue;
    private Long totalOrders;
    private Long newCustomers;
    private Long totalProducts;

    private Long totalCategories;
    private Long totalBrands;
    private Long lowStockCount;
    private Long unpaidOrders;

    private OrderStatusStats orderStatusStats;

    private List<RevenueTrendItem> revenueTrend;
    private List<TopSellingProductItem> topSellingProducts;
    private List<LowStockProductItem> lowStockProducts;
    private List<CategoryRevenueItem> categoryRevenue;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderStatusStats {
        private Long pending;
        private Long confirmed;
        private Long shipping;
        private Long completed;
        private Long cancelled;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueTrendItem {
        private String label;
        private BigDecimal revenue;
        private Long orderCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopSellingProductItem {
        private Integer productId;
        private String productName;
        private String productImage;
        private Long soldQuantity;
        private BigDecimal revenue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LowStockProductItem {
        private Integer productId;
        private String productName;
        private String categoryName;
        private String brandName;
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryRevenueItem {
        private String categoryName;
        private BigDecimal revenue;
    }
}