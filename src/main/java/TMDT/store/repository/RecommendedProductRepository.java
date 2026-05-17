package TMDT.store.repository;

import TMDT.store.entity.RecommendedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendedProductRepository extends JpaRepository<RecommendedProduct, Long> {
}