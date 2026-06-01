package TMDT.store.repository;

import TMDT.store.dto.response.DashboardResponse;
import TMDT.store.enums.OrderStatus;
import TMDT.store.enums.PaymentStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class DashboardRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public BigDecimal getCompletedRevenue(LocalDateTime start, LocalDateTime end) {
        BigDecimal result = entityManager.createQuery("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.status = :status
              AND o.createdAt BETWEEN :start AND :end
        """, BigDecimal.class)
                .setParameter("status", OrderStatus.COMPLETED)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return result;
    }

    public Long getTotalOrders(LocalDateTime start, LocalDateTime end) {
        return entityManager.createQuery("""
            SELECT COUNT(o.id)
            FROM Order o
            WHERE o.createdAt BETWEEN :start AND :end
        """, Long.class)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();
    }

    public Long getNewCustomers(LocalDateTime start, LocalDateTime end) {
        return entityManager.createQuery("""
            SELECT COUNT(u.id)
            FROM User u
            WHERE u.role = 'ROLE_USER'
              AND u.createdAt BETWEEN :start AND :end
        """, Long.class)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();
    }

    public Long getTotalProducts() {
        return entityManager.createQuery("""
            SELECT COUNT(p.id)
            FROM Product p
        """, Long.class).getSingleResult();
    }

    public Long getTotalCategories() {
        return entityManager.createQuery("""
            SELECT COUNT(c.id)
            FROM Category c
        """, Long.class).getSingleResult();
    }

    public Long getTotalBrands() {
        return entityManager.createQuery("""
            SELECT COUNT(b.id)
            FROM Brand b
        """, Long.class).getSingleResult();
    }

    public Long getLowStockCount(int threshold) {
        return entityManager.createQuery("""
            SELECT COUNT(p.id)
            FROM Product p
            WHERE p.quantity <= :threshold
        """, Long.class)
                .setParameter("threshold", threshold)
                .getSingleResult();
    }

    public Long getUnpaidOrders(LocalDateTime start, LocalDateTime end) {
        return entityManager.createQuery("""
            SELECT COUNT(o.id)
            FROM Order o
            WHERE o.paymentStatus = :paymentStatus
              AND o.createdAt BETWEEN :start AND :end
        """, Long.class)
                .setParameter("paymentStatus", PaymentStatus.UNPAID)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();
    }

    public Map<OrderStatus, Long> getOrderStatusStats(LocalDateTime start, LocalDateTime end) {
        List<Object[]> rows = entityManager.createQuery("""
            SELECT o.status, COUNT(o.id)
            FROM Order o
            WHERE o.createdAt BETWEEN :start AND :end
            GROUP BY o.status
        """, Object[].class)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        Map<OrderStatus, Long> result = new EnumMap<>(OrderStatus.class);

        for (Object[] row : rows) {
            result.put((OrderStatus) row[0], (Long) row[1]);
        }

        return result;
    }

    public List<DashboardResponse.TopSellingProductItem> getTopSellingProducts(
            LocalDateTime start,
            LocalDateTime end
    ) {
        List<Object[]> rows = entityManager.createQuery("""
            SELECT 
                oi.product.id,
                oi.productName,
                oi.productImage,
                SUM(oi.quantity),
                COALESCE(SUM(oi.totalPrice), 0)
            FROM OrderItem oi
            JOIN oi.order o
            WHERE o.status = :status
              AND o.createdAt BETWEEN :start AND :end
            GROUP BY oi.product.id, oi.productName, oi.productImage
            ORDER BY SUM(oi.quantity) DESC
        """, Object[].class)
                .setParameter("status", OrderStatus.COMPLETED)
                .setParameter("start", start)
                .setParameter("end", end)
                .setMaxResults(5)
                .getResultList();

        return rows.stream()
                .map(row -> DashboardResponse.TopSellingProductItem.builder()
                        .productId((Integer) row[0])
                        .productName((String) row[1])
                        .productImage((String) row[2])
                        .soldQuantity((Long) row[3])
                        .revenue((BigDecimal) row[4])
                        .build())
                .toList();
    }

    public List<DashboardResponse.LowStockProductItem> getLowStockProducts(int threshold) {
        List<Object[]> rows = entityManager.createQuery("""
            SELECT 
                p.id,
                p.name,
                c.name,
                b.name,
                p.quantity
            FROM Product p
            JOIN p.category c
            JOIN p.brand b
            WHERE p.quantity <= :threshold
            ORDER BY p.quantity ASC
        """, Object[].class)
                .setParameter("threshold", threshold)
                .setMaxResults(5)
                .getResultList();

        return rows.stream()
                .map(row -> DashboardResponse.LowStockProductItem.builder()
                        .productId((Integer) row[0])
                        .productName((String) row[1])
                        .categoryName((String) row[2])
                        .brandName((String) row[3])
                        .quantity((Integer) row[4])
                        .build())
                .toList();
    }

    public List<DashboardResponse.CategoryRevenueItem> getCategoryRevenue(
            LocalDateTime start,
            LocalDateTime end
    ) {
        List<Object[]> rows = entityManager.createQuery("""
            SELECT 
                c.name,
                COALESCE(SUM(oi.totalPrice), 0)
            FROM OrderItem oi
            JOIN oi.order o
            JOIN oi.product p
            JOIN p.category c
            WHERE o.status = :status
              AND o.createdAt BETWEEN :start AND :end
            GROUP BY c.id, c.name
            ORDER BY SUM(oi.totalPrice) DESC
        """, Object[].class)
                .setParameter("status", OrderStatus.COMPLETED)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        return rows.stream()
                .map(row -> DashboardResponse.CategoryRevenueItem.builder()
                        .categoryName((String) row[0])
                        .revenue((BigDecimal) row[1])
                        .build())
                .toList();
    }

    public List<DashboardResponse.RevenueTrendItem> getRevenueTrendByDay(
            LocalDateTime start,
            LocalDateTime end
    ) {
        List<Object[]> rows = entityManager.createNativeQuery("""
            SELECT 
                DATE(created_at) AS label_date,
                COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN total_amount ELSE 0 END), 0) AS revenue,
                COUNT(order_id) AS order_count
            FROM orders
            WHERE created_at BETWEEN :start AND :end
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        """)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        return rows.stream()
                .map(row -> {
                    Date sqlDate = (Date) row[0];

                    return DashboardResponse.RevenueTrendItem.builder()
                            .label(sqlDate.toLocalDate().format(formatter))
                            .revenue((BigDecimal) row[1])
                            .orderCount(((Number) row[2]).longValue())
                            .build();
                })
                .toList();
    }

    public List<DashboardResponse.RevenueTrendItem> getRevenueTrendByMonth(
            LocalDateTime start,
            LocalDateTime end
    ) {
        List<Object[]> rows = entityManager.createNativeQuery("""
            SELECT 
                DATE_FORMAT(created_at, '%m/%Y') AS month_label,
                COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN total_amount ELSE 0 END), 0) AS revenue,
                COUNT(order_id) AS order_count
            FROM orders
            WHERE created_at BETWEEN :start AND :end
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%m/%Y')
            ORDER BY DATE_FORMAT(created_at, '%Y-%m')
        """)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        return rows.stream()
                .map(row -> DashboardResponse.RevenueTrendItem.builder()
                        .label((String) row[0])
                        .revenue((BigDecimal) row[1])
                        .orderCount(((Number) row[2]).longValue())
                        .build())
                .toList();
    }
}