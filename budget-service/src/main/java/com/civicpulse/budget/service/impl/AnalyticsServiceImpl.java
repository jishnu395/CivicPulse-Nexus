package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.dto.response.AnalyticsDashboardResponse;
import com.civicpulse.budget.enums.PaymentStatus;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.repository.ExpenseRepository;
import com.civicpulse.budget.repository.FundDistributionRepository;
import com.civicpulse.budget.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BudgetRepository budgetRepository;

    private final ExpenseRepository expenseRepository;

    private final FundDistributionRepository paymentRepository;

    @Override
    public AnalyticsDashboardResponse dashboard() {

        BigDecimal allocated = budgetRepository.getTotalAllocated();

        BigDecimal utilized = budgetRepository.getTotalUtilized();

        BigDecimal remaining = budgetRepository.getTotalRemaining();

        double utilization = 0;

        if (allocated.compareTo(BigDecimal.ZERO) > 0) {

            utilization = utilized
                    .multiply(BigDecimal.valueOf(100))
                    .divide(allocated,2,RoundingMode.HALF_UP)
                    .doubleValue();

        }

        return AnalyticsDashboardResponse.builder()

                .totalAllocatedBudget(allocated)

                .totalUtilizedBudget(utilized)

                .totalRemainingBudget(remaining)

                .utilizationPercentage(utilization)

                .totalPayments(paymentRepository.count())

                .completedPayments(
                        paymentRepository.countByPaymentStatus(
                                PaymentStatus.COMPLETED))

                .pendingPayments(
                        paymentRepository.countByPaymentStatus(
                                PaymentStatus.PENDING))

                .failedPayments(
                        paymentRepository.countByPaymentStatus(
                                PaymentStatus.FAILED))

                .totalDistributedFunds(
                        paymentRepository.totalDistributed())

                .totalExpenses(
                        expenseRepository.count())

                .departments(
                        budgetRepository.countDepartments()
                )

                .build();

    }

}