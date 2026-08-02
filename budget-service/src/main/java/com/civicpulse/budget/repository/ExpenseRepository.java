package com.civicpulse.budget.repository;

import com.civicpulse.budget.entity.Expense;
import com.civicpulse.budget.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByBudgetId(Long budgetId);

    List<Expense> findByDepartment(String department);

    List<Expense> findByCategory(ExpenseCategory category);

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            """)
    BigDecimal totalExpensesAmount();

}