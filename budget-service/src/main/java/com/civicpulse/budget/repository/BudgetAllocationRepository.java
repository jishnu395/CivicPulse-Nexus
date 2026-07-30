package com.civicpulse.budget.repository;

import com.civicpulse.budget.entity.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetAllocationRepository
        extends JpaRepository<BudgetAllocation, Long> {

    List<BudgetAllocation> findByBudgetId(Long budgetId);

    List<BudgetAllocation> findBySchemeId(Long schemeId);
}