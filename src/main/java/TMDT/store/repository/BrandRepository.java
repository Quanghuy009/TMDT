package TMDT.store.repository;

import TMDT.store.dto.response.AdminBrandResponse;
import TMDT.store.entity.Brand;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Integer> {

    boolean existsByName(String name);

    Optional<Brand> findByName(String name);

    @Query("""
        SELECT new TMDT.store.dto.response.AdminBrandResponse(
            b.id,
            b.name,
            b.country,
            COUNT(p.id)
        )
        FROM Brand b
        LEFT JOIN b.products p
        GROUP BY b.id, b.name, b.country
        ORDER BY b.id DESC
    """)
    List<AdminBrandResponse> findAllAdminBrands();

    @Query("""
        SELECT COUNT(p.id)
        FROM Product p
        WHERE p.brand.id = :brandId
    """)
    long countProductsByBrandId(@Param("brandId") Integer brandId);
}