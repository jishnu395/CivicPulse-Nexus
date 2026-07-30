package com.civicpulse.welfare.entity;

import com.civicpulse.welfare.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private Double benefitAmount;

    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
}