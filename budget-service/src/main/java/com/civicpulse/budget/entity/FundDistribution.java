package com.civicpulse.budget.entity;

import com.civicpulse.budget.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_distribution")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long beneficiaryId;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private Long budgetId;

    private BigDecimal amount;

    @Column(unique = true)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime distributedAt;

}