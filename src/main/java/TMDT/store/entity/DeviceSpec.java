package TMDT.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "device_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spec_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private String cpuChip;
    private String gpuChip;
    private String ram;
    private String storageCapacity;
    private String frontCamera;
    private String rearCamera;
    private String screenSize;
    private String screenResolution;
    private String displayTechnology;
    private String batteryCapacity;
    private String chargingPower;
    private String utilities;
}