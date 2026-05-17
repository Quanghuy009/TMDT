package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Integer id;

    @Column(name = "brand_name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "country", length = 100)
    private String country;

    @OneToMany(mappedBy = "brand")
    private List<Product> products = new ArrayList<>();
}
