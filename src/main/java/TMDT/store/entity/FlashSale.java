package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "flash_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flash_sale_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    private Boolean active = true;

    private Integer priority = 0;

    @OneToMany(mappedBy = "flashSale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlashSaleItem> items = new ArrayList<>();
}