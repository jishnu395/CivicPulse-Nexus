package com.civicpulse.budget.mapper;

import com.civicpulse.budget.dto.response.BudgetResponse;
import com.civicpulse.budget.entity.Budget;
import org.springframework.stereotype.Component;

@Component
public class BudgetMapper {

    public BudgetResponse toResponse(Budget budget){

        return BudgetResponse.builder()
                .id(budget.getId())
                .department(budget.getDepartment())
                .financialYear(budget.getFinancialYear())
                .allocatedAmount(budget.getAllocatedAmount())
                .utilizedAmount(budget.getUtilizedAmount())
                .remainingAmount(budget.getRemainingAmount())
                .createdDate(budget.getCreatedDate())
                .build();

    }

}