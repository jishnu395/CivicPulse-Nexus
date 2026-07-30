package com.civicpulse.budget.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class BudgetResponse {

    private Long id;

    private String department;

    private String financialYear;

    private BigDecimal allocatedAmount;

    private BigDecimal utilizedAmount;

    private BigDecimal remainingAmount;

    private LocalDate createdDate;

}