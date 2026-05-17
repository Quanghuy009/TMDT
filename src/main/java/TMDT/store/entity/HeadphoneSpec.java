package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "headphone_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeadphoneSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private String headphoneType;
    private String connectionDistance;
    private String audioTechnology;
    private String compatibleOs;
    private String batteryLife;
    private String jackType;
    private String utilities;
}
