package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.request.UpdateBudgetRequest;
import com.civicpulse.budget.dto.response.BudgetDashboardResponse;
import com.civicpulse.budget.dto.response.BudgetResponse;
import com.civicpulse.budget.entity.Budget;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.BudgetMapper;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.service.AuditLogService;
import com.civicpulse.budget.service.BudgetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;
    private final AuditLogService auditLogService;

    @Override
    public BudgetResponse create(CreateBudgetRequest request) {

        budgetRepository.findByDepartment(request.getDepartment())
                .ifPresent(b -> {
                    throw new RuntimeException("Budget already exists.");
                });

        Budget budget = Budget.builder()
                .department(request.getDepartment())
                .financialYear(request.getFinancialYear())
                .allocatedAmount(request.getAllocatedAmount())
                .utilizedAmount(BigDecimal.ZERO)
                .remainingAmount(request.getAllocatedAmount())
                .createdDate(LocalDate.now())
                .build();

        budget = budgetRepository.save(budget);

        auditLogService.log(
                "BUDGET",
                budget.getId(),
                "CREATE",
                "SYSTEM",
                "Budget created successfully."
        );

        return budgetMapper.toResponse(budget);
    }

    @Override
    public BudgetResponse update(Long id, UpdateBudgetRequest request) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        budget.setDepartment(request.getDepartment());
        budget.setFinancialYear(request.getFinancialYear());
        budget.setAllocatedAmount(request.getAllocatedAmount());
        budget.setRemainingAmount(
                request.getAllocatedAmount()
                        .subtract(budget.getUtilizedAmount()));

        budget = budgetRepository.save(budget);

        auditLogService.log(
                "BUDGET",
                budget.getId(),
                "UPDATE",
                "SYSTEM",
                "Budget updated successfully."
        );

        return budgetMapper.toResponse(budget);
    }

    @Override
    public void delete(Long id) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        auditLogService.log(
                "BUDGET",
                budget.getId(),
                "DELETE",
                "SYSTEM",
                "Budget deleted successfully."
        );

        budgetRepository.delete(budget);
    }

    @Override
    public List<BudgetResponse> getAll() {
        return budgetRepository.findAll()
                .stream()
                .map(budgetMapper::toResponse)
                .toList();
    }

    @Override
    public BudgetResponse getById(Long id) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        return budgetMapper.toResponse(budget);
    }

    @Override
    public BudgetDashboardResponse dashboard() {

        BigDecimal totalAllocated = budgetRepository.getTotalAllocated();
        BigDecimal totalUtilized = budgetRepository.getTotalUtilized();
        BigDecimal totalRemaining = budgetRepository.getTotalRemaining();

        if (totalAllocated == null) totalAllocated = BigDecimal.ZERO;
        if (totalUtilized == null) totalUtilized = BigDecimal.ZERO;
        if (totalRemaining == null) totalRemaining = BigDecimal.ZERO;

        double utilization = 0;

        if (totalAllocated.compareTo(BigDecimal.ZERO) > 0) {
            utilization = totalUtilized
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalAllocated, 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new BudgetDashboardResponse(
                totalAllocated,
                totalUtilized,
                totalRemaining,
                utilization
        );
    }

    @Override
    public double utilization(Long budgetId) {

        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        if (budget.getAllocatedAmount().compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }

        return budget.getUtilizedAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(budget.getAllocatedAmount(), 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Override
    public BigDecimal remaining(Long budgetId) {

        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        return budget.getRemainingAmount();
    }
}