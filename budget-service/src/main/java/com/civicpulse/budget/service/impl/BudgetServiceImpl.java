package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.response.BudgetResponse;
import com.civicpulse.budget.entity.Budget;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.BudgetMapper;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;

    @Override
    public BudgetResponse create(CreateBudgetRequest request) {

        budgetRepository.findByDepartment(request.getDepartment())
                .ifPresent(budget -> {
                    throw new RuntimeException("Budget already exists for department.");
                });

        Budget budget = Budget.builder()
                .department(request.getDepartment())
                .financialYear(request.getFinancialYear())
                .allocatedAmount(request.getAllocatedAmount())
                .utilizedAmount(BigDecimal.ZERO)
                .remainingAmount(request.getAllocatedAmount())
                .createdDate(LocalDate.now())
                .build();

        return budgetMapper.toResponse(
                budgetRepository.save(budget)
        );
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

}