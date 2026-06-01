package TMDT.store.repository;

import TMDT.store.entity.BestSellerProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BestSellerProductRepository extends JpaRepository<BestSellerProduct, Long> {

    List<BestSellerProduct> findAllByOrderByIdDesc();

    boolean existsByProductId(Integer productId);

    Optional<BestSellerProduct> findByProductId(Integer productId);
}