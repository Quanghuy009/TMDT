package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "featured_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeaturedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "featured_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
