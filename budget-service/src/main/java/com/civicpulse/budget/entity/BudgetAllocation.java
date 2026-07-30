package com.civicpulse.budget.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "budget_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long budgetId;

    @Column(nullable = false)
    private Long schemeId;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal utilizedAmount;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal remainingAmount;

    @Column(nullable = false)
    private LocalDate allocatedDate;
}