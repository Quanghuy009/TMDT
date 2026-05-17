package TMDT.store.repository;

import TMDT.store.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, Long> {

    List<FlashSaleItem> findByFlashSaleId(Long flashSaleId);

    Optional<FlashSaleItem> findByFlashSaleIdAndProductId(Long flashSaleId, Integer productId);
}