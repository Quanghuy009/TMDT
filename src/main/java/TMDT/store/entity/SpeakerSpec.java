package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "speaker_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpeakerSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private String speakerType;
    private String powerOutput;
    private String batteryLife;
    private String audioTechnology;
    private String wirelessTechnology;
    private String size;
    private String utilities;
}
