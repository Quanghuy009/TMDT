package TMDT.store.repository;

import TMDT.store.entity.Order;
import TMDT.store.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    @Query("""
        SELECT o
        FROM Order o
        ORDER BY o.createdAt DESC
    """)
    List<Order> findAllAdminOrders();

    @EntityGraph(attributePaths = {
            "user",
            "items",
            "items.product"
    })
    @Query("""
        SELECT o
        FROM Order o
        WHERE o.id = :id
    """)
    Optional<Order> findAdminOrderDetailById(@Param("id") Integer id);
}