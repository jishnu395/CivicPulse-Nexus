package com.civicpulse.budget.mapper;

import com.civicpulse.budget.dto.response.BudgetAllocationResponse;
import com.civicpulse.budget.entity.BudgetAllocation;
import org.springframework.stereotype.Component;

@Component
public class BudgetAllocationMapper {

    public BudgetAllocationResponse toResponse(BudgetAllocation allocation){

        return BudgetAllocationResponse.builder()
                .id(allocation.getId())
                .budgetId(allocation.getBudgetId())
                .schemeId(allocation.getSchemeId())
                .allocatedAmount(allocation.getAllocatedAmount())
                .utilizedAmount(allocation.getUtilizedAmount())
                .remainingAmount(allocation.getRemainingAmount())
                .allocatedDate(allocation.getAllocatedDate())
                .build();
    }
}