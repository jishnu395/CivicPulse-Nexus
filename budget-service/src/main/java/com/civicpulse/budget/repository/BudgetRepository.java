package com.civicpulse.budget.repository;

import com.civicpulse.budget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByDepartment(String department);

    List<Budget> findByFinancialYear(String financialYear);

}