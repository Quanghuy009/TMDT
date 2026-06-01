package TMDT.store.repository;

import TMDT.store.entity.FeaturedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeaturedProductRepository extends JpaRepository<FeaturedProduct, Long> {

    List<FeaturedProduct> findAllByOrderByIdDesc();

    boolean existsByProductId(Integer productId);

    Optional<FeaturedProduct> findByProductId(Integer productId);
}