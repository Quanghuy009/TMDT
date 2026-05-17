package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mouse_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MouseSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private String mouseType;
    private String compatibleOs;
    private String connectionDistance;
    private String batteryType;
    private String size;
    private String specialFeatures;
}
