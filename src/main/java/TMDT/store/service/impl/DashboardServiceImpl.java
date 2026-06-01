package TMDT.store.service.impl;

import TMDT.store.dto.response.DashboardResponse;
import TMDT.store.enums.OrderStatus;
import TMDT.store.repository.DashboardRepository;
import TMDT.store.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final DashboardRepository dashboardRepository;

    @Override
    public DashboardResponse getDashboard(String range, LocalDate startDate, LocalDate endDate) {
        DateRange dateRange = resolveDateRange(range, startDate, endDate);

        LocalDateTime start = dateRange.startDate().atStartOfDay();
        LocalDateTime end = dateRange.endDate().atTime(23, 59, 59);

        Map<OrderStatus, Long> statusStats = dashboardRepository.getOrderStatusStats(start, end);

        return DashboardResponse.builder()
                .completedRevenue(dashboardRepository.getCompletedRevenue(start, end))
                .totalOrders(dashboardRepository.getTotalOrders(start, end))
                .newCustomers(dashboardRepository.getNewCustomers(start, end))
                .totalProducts(dashboardRepository.getTotalProducts())
                .totalCategories(dashboardRepository.getTotalCategories())
                .totalBrands(dashboardRepository.getTotalBrands())
                .lowStockCount(dashboardRepository.getLowStockCount(LOW_STOCK_THRESHOLD))
                .unpaidOrders(dashboardRepository.getUnpaidOrders(start, end))
                .orderStatusStats(
                        DashboardResponse.OrderStatusStats.builder()
                                .pending(statusStats.getOrDefault(OrderStatus.PENDING, 0L))
                                .confirmed(statusStats.getOrDefault(OrderStatus.CONFIRMED, 0L))
                                .shipping(statusStats.getOrDefault(OrderStatus.SHIPPING, 0L))
                                .completed(statusStats.getOrDefault(OrderStatus.COMPLETED, 0L))
                                .cancelled(statusStats.getOrDefault(OrderStatus.CANCELLED, 0L))
                                .build()
                )
                .revenueTrend(
                        shouldGroupByMonth(range, dateRange)
                                ? dashboardRepository.getRevenueTrendByMonth(start, end)
                                : dashboardRepository.getRevenueTrendByDay(start, end)
                )
                .topSellingProducts(dashboardRepository.getTopSellingProducts(start, end))
                .lowStockProducts(dashboardRepository.getLowStockProducts(LOW_STOCK_THRESHOLD))
                .categoryRevenue(dashboardRepository.getCategoryRevenue(start, end))
                .build();
    }

    private DateRange resolveDateRange(String range, LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                throw new RuntimeException("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            }

            return new DateRange(startDate, endDate);
        }

        if (range == null || range.isBlank()) {
            range = "7d";
        }

        return switch (range) {
            case "1m" -> new DateRange(today.minusDays(29), today);
            case "1y" -> new DateRange(today.minusYears(1).plusDays(1), today);
            case "7d" -> new DateRange(today.minusDays(6), today);
            default -> new DateRange(today.minusDays(6), today);
        };
    }

    private boolean shouldGroupByMonth(String range, DateRange dateRange) {
        if ("1y".equals(range)) {
            return true;
        }

        long days = java.time.temporal.ChronoUnit.DAYS.between(
                dateRange.startDate(),
                dateRange.endDate()
        ) + 1;

        return days > 90;
    }

    private record DateRange(LocalDate startDate, LocalDate endDate) {
    }
}