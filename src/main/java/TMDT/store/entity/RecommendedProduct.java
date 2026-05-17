package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommended_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommended_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}