package com.civicpulse.servicemanagement.entity;

import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
import com.civicpulse.servicemanagement.enums.PermitType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_no", nullable = false, unique = true)
    private String applicationNo;

    @Column(name = "citizen_id", nullable = false)
    private Long citizenId;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type")
    private CertificateType certificateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "permit_type")
    private PermitType permitType;

    @Enumerated(EnumType.STRING)
    @Column(name = "department", nullable = false)
    private DepartmentType department;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "fee_amount", columnDefinition = "DOUBLE PRECISION DEFAULT 20.0")
    @Builder.Default
    private Double feeAmount = 20.0;

    @Column(name = "payment_status", columnDefinition = "VARCHAR(255) DEFAULT 'PAID'")
    @Builder.Default
    private String paymentStatus = "PAID";

    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @OneToOne(
            mappedBy = "application",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private Certificate certificate;

    @OneToOne(
            mappedBy = "application",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private Permit permit;

    @Column(name = "remarks", length = 1000)
    private String remarks;
}