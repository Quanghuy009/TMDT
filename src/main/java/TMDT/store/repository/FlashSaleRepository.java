package TMDT.store.repository;

import TMDT.store.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
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
    Optional<FlashSale> findCurrentFlashSale(@Param("now") LocalDateTime now);

    List<FlashSale> findAllByOrderByIdDesc();

    @Query("""
        SELECT fs
        FROM FlashSale fs
        WHERE fs.active = true
          AND fs.endTime > :now
        ORDER BY fs.endTime DESC
    """)
    List<FlashSale> findActiveFlashSalesNotExpired(@Param("now") LocalDateTime now);

    @Query("""
        SELECT fs
        FROM FlashSale fs
        WHERE fs.active = true
          AND fs.endTime > :now
          AND fs.id <> :flashSaleId
        ORDER BY fs.endTime DESC
    """)
    List<FlashSale> findOtherActiveFlashSalesNotExpired(
            @Param("flashSaleId") Long flashSaleId,
            @Param("now") LocalDateTime now
    );
}