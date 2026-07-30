package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.client.WelfareFeignClient;
import com.civicpulse.budget.dto.request.CreateBudgetAllocationRequest;
import com.civicpulse.budget.dto.response.BudgetAllocationResponse;
import com.civicpulse.budget.entity.Budget;
import com.civicpulse.budget.entity.BudgetAllocation;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.BudgetAllocationMapper;
import com.civicpulse.budget.repository.BudgetAllocationRepository;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.service.BudgetAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetAllocationServiceImpl implements BudgetAllocationService {

    private final BudgetRepository budgetRepository;
    private final BudgetAllocationRepository allocationRepository;
    private final BudgetAllocationMapper mapper;
    private final WelfareFeignClient welfareFeignClient;

    @Override
    public BudgetAllocationResponse allocate(CreateBudgetAllocationRequest request) {

        Budget budget = budgetRepository.findById(request.getBudgetId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found"));

        // Verify Welfare Scheme Exists
        welfareFeignClient.getScheme(request.getSchemeId());

        if (budget.getRemainingAmount().compareTo(request.getAllocatedAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient Budget.");
        }

        BudgetAllocation allocation = BudgetAllocation.builder()
                .budgetId(request.getBudgetId())
                .schemeId(request.getSchemeId())
                .allocatedAmount(request.getAllocatedAmount())
                .utilizedAmount(BigDecimal.ZERO)
                .remainingAmount(request.getAllocatedAmount())
                .allocatedDate(LocalDate.now())
                .build();

        allocationRepository.save(allocation);

        budget.setUtilizedAmount(
                budget.getUtilizedAmount()
                        .add(request.getAllocatedAmount())
        );

        budget.setRemainingAmount(
                budget.getRemainingAmount()
                        .subtract(request.getAllocatedAmount())
        );

        budgetRepository.save(budget);

        return mapper.toResponse(allocation);
    }

    @Override
    public List<BudgetAllocationResponse> getAll() {

        return allocationRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<BudgetAllocationResponse> getByBudget(Long budgetId) {

        return allocationRepository.findByBudgetId(budgetId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}