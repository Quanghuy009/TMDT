package TMDT.store.repository;

import TMDT.store.dto.response.AdminProductResponse;
import TMDT.store.entity.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("""
        SELECT new TMDT.store.dto.response.AdminProductResponse(
            p.id,
            p.name,
            p.image,
            c.name,
            c.name,
            b.name,
            p.price,
            p.quantity
        )
        FROM Product p
        JOIN p.category c
        JOIN p.brand b
        ORDER BY p.id DESC
    """)
    List<AdminProductResponse> findAllAdminProducts();

    @EntityGraph(attributePaths = {
            "category",
            "brand",
            "deviceSpec",
            "headphoneSpec",
            "keyboardSpec",
            "mouseSpec",
            "speakerSpec"
    })
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findDetailById(@Param("id") Integer id);
}