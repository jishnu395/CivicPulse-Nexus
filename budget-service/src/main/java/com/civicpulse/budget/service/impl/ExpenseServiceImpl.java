package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.dto.request.CreateExpenseRequest;
import com.civicpulse.budget.dto.response.ExpenseResponse;
import com.civicpulse.budget.entity.Budget;
import com.civicpulse.budget.entity.Expense;
import com.civicpulse.budget.enums.ExpenseCategory;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.ExpenseMapper;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.repository.ExpenseRepository;
import com.civicpulse.budget.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseMapper expenseMapper;

    @Override
    public ExpenseResponse create(CreateExpenseRequest request) {

        Budget budget = budgetRepository.findById(request.getBudgetId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        if (budget.getRemainingAmount().compareTo(request.getAmount()) < 0) {
            throw new IllegalStateException("Insufficient budget.");
        }

        Expense expense = Expense.builder()
                .budgetId(request.getBudgetId())
                .department(request.getDepartment())
                .category(request.getCategory())
                .description(request.getDescription())
                .amount(request.getAmount())
                .createdAt(LocalDateTime.now())
                .build();

        budget.setUtilizedAmount(
                budget.getUtilizedAmount().add(request.getAmount()));

        budget.setRemainingAmount(
                budget.getRemainingAmount().subtract(request.getAmount()));

        budgetRepository.save(budget);

        return expenseMapper.toResponse(
                expenseRepository.save(expense));
    }

    @Override
    public List<ExpenseResponse> getAll() {
        return expenseRepository.findAll()
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    public ExpenseResponse getById(Long id) {

        return expenseMapper.toResponse(
                expenseRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Expense not found.")));
    }

    @Override
    public List<ExpenseResponse> getByBudget(Long budgetId) {

        return expenseRepository.findByBudgetId(budgetId)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    public List<ExpenseResponse> getByDepartment(String department) {

        return expenseRepository.findByDepartment(department)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    public List<ExpenseResponse> getByCategory(ExpenseCategory category) {

        return expenseRepository.findByCategory(category)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found."));

        Budget budget = budgetRepository.findById(expense.getBudgetId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        budget.setUtilizedAmount(
                budget.getUtilizedAmount().subtract(expense.getAmount()));

        budget.setRemainingAmount(
                budget.getRemainingAmount().add(expense.getAmount()));

        budgetRepository.save(budget);

        expenseRepository.delete(expense);
    }
}