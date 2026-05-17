package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "keyboard_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyboardSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private String keyboardType;
    private String compatibleOs;
    private String connectionDistance;
    private String wirelessTechnology;
    private String keyboardLayout;
    private Integer keyCount;
    private String size;
    private String utilities;
}
