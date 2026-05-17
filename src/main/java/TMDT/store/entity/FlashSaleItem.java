package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "flash_sale_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flash_sale_item_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sale_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "quantity_limit")
    private Integer quantityLimit = 0;

    @Column(name = "sold_quantity")
    private Integer soldQuantity = 0;
}