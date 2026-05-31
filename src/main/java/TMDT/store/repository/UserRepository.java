package TMDT.store.repository;

import TMDT.store.dto.response.AdminCustomerResponse;
import TMDT.store.entity.User;
import org.springframework.data.jpa.repository.*;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
        SELECT new TMDT.store.dto.response.AdminCustomerResponse(
            u.id,
            u.fullName,
            u.email,
            u.role,
            u.active,
            COUNT(o.id),
            u.createdAt
        )
        FROM User u
        LEFT JOIN Order o ON o.user = u
        GROUP BY u.id, u.fullName, u.email, u.role, u.active, u.createdAt
        ORDER BY u.id DESC
    """)
    List<AdminCustomerResponse> findAllAdminCustomers();

    @Query("""
        SELECT new TMDT.store.dto.response.AdminCustomerResponse(
            u.id,
            u.fullName,
            u.email,
            u.role,
            u.active,
            COUNT(o.id),
            u.createdAt
        )
        FROM User u
        LEFT JOIN Order o ON o.user = u
        WHERE u.id = :userId
        GROUP BY u.id, u.fullName, u.email, u.role, u.active, u.createdAt
    """)
    Optional<AdminCustomerResponse> findAdminCustomerById(Integer userId);
}