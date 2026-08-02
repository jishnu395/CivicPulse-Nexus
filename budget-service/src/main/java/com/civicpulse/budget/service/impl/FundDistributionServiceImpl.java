package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.client.WelfareFeignClient;
import com.civicpulse.budget.dto.request.CreateFundDistributionRequest;
import com.civicpulse.budget.dto.response.FundDistributionResponse;
import com.civicpulse.budget.entity.Budget;
import com.civicpulse.budget.entity.FundDistribution;
import com.civicpulse.budget.enums.PaymentStatus;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.FundDistributionMapper;
import com.civicpulse.budget.repository.BudgetRepository;
import com.civicpulse.budget.repository.FundDistributionRepository;
import com.civicpulse.budget.service.FundDistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FundDistributionServiceImpl implements FundDistributionService {

    private final FundDistributionRepository repository;
    private final BudgetRepository budgetRepository;
    private final FundDistributionMapper mapper;
    private final WelfareFeignClient welfareFeignClient;

    @Override
    public FundDistributionResponse distribute(CreateFundDistributionRequest request) {

        // Verify beneficiary exists
        Object beneficiary = welfareFeignClient.getBeneficiary(request.getBeneficiaryId());

        if (beneficiary == null) {
            throw new ResourceNotFoundException("Beneficiary not found.");
        }

        // Verify scheme exists
        Object scheme = welfareFeignClient.getScheme(request.getSchemeId());

        if (scheme == null) {
            throw new ResourceNotFoundException("Scheme not found.");
        }

        // Prevent duplicate completed payment
        if (repository.existsByBeneficiaryIdAndSchemeIdAndPaymentStatus(
                request.getBeneficiaryId(),
                request.getSchemeId(),
                PaymentStatus.COMPLETED)) {

            throw new IllegalStateException(
                    "Payment already released for this beneficiary.");
        }

        Budget budget = budgetRepository.findById(request.getBudgetId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Budget not found."));

        if (budget.getRemainingAmount().compareTo(request.getAmount()) < 0) {
            throw new IllegalStateException("Insufficient budget.");
        }

        FundDistribution distribution = FundDistribution.builder()
                .beneficiaryId(request.getBeneficiaryId())
                .citizenId(request.getCitizenId())
                .schemeId(request.getSchemeId())
                .budgetId(request.getBudgetId())
                .amount(request.getAmount())
                .transactionId(UUID.randomUUID().toString())
                .paymentStatus(PaymentStatus.PENDING)
                .distributedAt(LocalDateTime.now())
                .build();

        budget.setUtilizedAmount(
                budget.getUtilizedAmount().add(request.getAmount()));

        budget.setRemainingAmount(
                budget.getRemainingAmount().subtract(request.getAmount()));

        budgetRepository.save(budget);

        distribution = repository.save(distribution);

        return mapper.toResponse(distribution);
    }

    @Override
    public List<FundDistributionResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public FundDistributionResponse getById(Long id) {

        FundDistribution distribution = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Distribution not found."));

        return mapper.toResponse(distribution);
    }

    @Override
    public List<FundDistributionResponse> getByCitizen(Long citizenId) {

        return repository.findByCitizenId(citizenId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<FundDistributionResponse> getByBeneficiary(Long beneficiaryId) {

        return repository.findByBeneficiaryId(beneficiaryId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<FundDistributionResponse> getByStatus(PaymentStatus status) {

        return repository.findByPaymentStatus(status)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public FundDistributionResponse complete(Long id) {

        FundDistribution payment = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Distribution not found."));

        payment.setPaymentStatus(PaymentStatus.COMPLETED);

        return mapper.toResponse(repository.save(payment));
    }

    @Override
    public FundDistributionResponse fail(Long id) {

        FundDistribution payment = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Distribution not found."));

        payment.setPaymentStatus(PaymentStatus.FAILED);

        return mapper.toResponse(repository.save(payment));
    }
}