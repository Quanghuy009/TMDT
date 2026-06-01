package TMDT.store.repository;

import TMDT.store.entity.RecommendedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecommendedProductRepository extends JpaRepository<RecommendedProduct, Long> {

    List<RecommendedProduct> findAllByOrderByIdDesc();

    boolean existsByProductId(Integer productId);

    Optional<RecommendedProduct> findByProductId(Integer productId);
}