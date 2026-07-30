package com.civicpulse.budget.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String financialYear;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal utilizedAmount;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal remainingAmount;

    @Column(nullable = false)
    private LocalDate createdDate;
}