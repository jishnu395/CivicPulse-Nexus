package com.civicpulse.budget.entity;

import com.civicpulse.budget.enums.ExpenseCategory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long budgetId;

    private String department;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;

    private String description;

    private BigDecimal amount;

    private LocalDateTime createdAt;

}