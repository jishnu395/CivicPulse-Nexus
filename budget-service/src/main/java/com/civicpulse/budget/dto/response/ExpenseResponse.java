package com.civicpulse.budget.dto.response;

import com.civicpulse.budget.enums.ExpenseCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;

    private Long budgetId;

    private String department;

    private ExpenseCategory category;

    private String description;

    private BigDecimal amount;

    private LocalDateTime createdAt;

}