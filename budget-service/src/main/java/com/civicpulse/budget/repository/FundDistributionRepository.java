package com.civicpulse.budget.repository;

import com.civicpulse.budget.entity.FundDistribution;
import com.civicpulse.budget.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface FundDistributionRepository extends JpaRepository<FundDistribution, Long> {

    List<FundDistribution> findByCitizenId(Long citizenId);

    List<FundDistribution> findByBeneficiaryId(Long beneficiaryId);

    List<FundDistribution> findByPaymentStatus(PaymentStatus status);

    Optional<FundDistribution> findByTransactionId(String transactionId);

    boolean existsByBeneficiaryIdAndSchemeIdAndPaymentStatus(
            Long beneficiaryId,
            Long schemeId,
            PaymentStatus paymentStatus
    );

    long countByPaymentStatus(PaymentStatus status);

    @Query("""
            SELECT COALESCE(SUM(f.amount), 0)
            FROM FundDistribution f
            WHERE f.paymentStatus = com.civicpulse.budget.enums.PaymentStatus.COMPLETED
            """)
    BigDecimal totalDistributed();

}