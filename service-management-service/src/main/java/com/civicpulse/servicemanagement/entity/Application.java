package com.civicpulse.servicemanagement.entity;

import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
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

    @Column(nullable = false, unique = true)
    private String applicationNo;

    @Column(nullable = false)
    private Long citizenId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateType certificateType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DepartmentType department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(nullable = false)
    private LocalDateTime submissionDate;

    private LocalDateTime approvalDate;

    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @OneToOne(
            mappedBy = "application",
            cascade = CascadeType.ALL
    )
    private Certificate certificate;

    @Column(length = 1000)
    private String remarks;
}