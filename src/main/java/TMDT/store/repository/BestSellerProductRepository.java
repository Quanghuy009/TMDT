package TMDT.store.repository;

import TMDT.store.entity.BestSellerProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BestSellerProductRepository extends JpaRepository<BestSellerProduct, Long> {
}