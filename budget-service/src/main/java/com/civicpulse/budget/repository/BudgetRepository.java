package com.civicpulse.budget.repository;

import com.civicpulse.budget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByDepartment(String department);

    @Query("""
            SELECT COUNT(DISTINCT b.department)
            FROM Budget b
            """)
    long countDepartments();

    @Query("""
            SELECT COALESCE(SUM(b.allocatedAmount), 0)
            FROM Budget b
            """)
    BigDecimal getTotalAllocated();

    @Query("""
            SELECT COALESCE(SUM(b.utilizedAmount), 0)
            FROM Budget b
            """)
    BigDecimal getTotalUtilized();

    @Query("""
            SELECT COALESCE(SUM(b.remainingAmount), 0)
            FROM Budget b
            """)
    BigDecimal getTotalRemaining();

}