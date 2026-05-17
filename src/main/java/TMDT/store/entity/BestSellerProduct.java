package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "best_seller_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BestSellerProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "best_seller_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}