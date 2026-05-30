package TMDT.store.repository;

import TMDT.store.dto.response.AdminCategoryResponse;
import TMDT.store.entity.Category;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    boolean existsByName(String name);

    Optional<Category> findByName(String name);

    @Query("""
        SELECT new TMDT.store.dto.response.AdminCategoryResponse(
            c.id,
            c.name,
            COUNT(p.id)
        )
        FROM Category c
        LEFT JOIN c.products p
        GROUP BY c.id, c.name
        ORDER BY c.id DESC
    """)
    List<AdminCategoryResponse> findAllAdminCategories();

    @Query("""
        SELECT COUNT(p.id)
        FROM Product p
        WHERE p.category.id = :categoryId
    """)
    long countProductsByCategoryId(@Param("categoryId") Integer categoryId);
}