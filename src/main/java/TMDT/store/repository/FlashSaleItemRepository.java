package TMDT.store.repository;

import TMDT.store.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, Long> {

    List<FlashSaleItem> findByFlashSaleId(Long flashSaleId);

    Optional<FlashSaleItem> findByFlashSaleIdAndProductId(
            Long flashSaleId,
            Integer productId
    );

    @Query("""
        SELECT fsi
        FROM FlashSaleItem fsi
        WHERE fsi.product.id = :productId
          AND fsi.flashSale.active = true
          AND CURRENT_TIMESTAMP BETWEEN fsi.flashSale.startTime AND fsi.flashSale.endTime
        ORDER BY fsi.flashSale.priority DESC, fsi.id DESC
    """)
    List<FlashSaleItem> findActiveItemsByProductId(
            @Param("productId") Integer productId
    );
}