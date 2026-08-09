package com.civicpulse.welfare.entity;

import com.civicpulse.welfare.enums.SchemeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "welfare_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelfareScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String schemeName;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false, length = 1000)
    private String eligibilityCriteria;

    @Column(nullable = false)
    private Double benefitAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SchemeStatus status;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Builder.Default
    private Integer minAge = 0;

    @Builder.Default
    private Integer maxAge = 120;

    @Builder.Default
    private Double maxAnnualIncome = 1000000.0;

    @Builder.Default
    private String eligibleWards = "ALL";

    @Builder.Default
    private String requiredDocuments = "Aadhaar, Income Certificate";
}