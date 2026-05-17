package TMDT.store.repository;

import TMDT.store.entity.FeaturedProduct;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeaturedProductRepository extends JpaRepository<FeaturedProduct, Long> {

}
