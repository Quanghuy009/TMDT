package TMDT.store.repository;

import TMDT.store.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    @Query("""
        SELECT fs
        FROM FlashSale fs
        WHERE fs.active = true
          AND fs.startTime <= :now
          AND fs.endTime > :now
        ORDER BY fs.priority DESC, fs.startTime DESC
    """)
    Optional<FlashSale> findCurrentFlashSale(LocalDateTime now);
}