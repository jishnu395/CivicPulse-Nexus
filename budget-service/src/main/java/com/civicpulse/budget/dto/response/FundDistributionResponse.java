package com.civicpulse.budget.dto.response;

import com.civicpulse.budget.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundDistributionResponse {

    private Long id;

    private Long beneficiaryId;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private Long budgetId;

    private BigDecimal amount;

    private String transactionId;

    private PaymentStatus paymentStatus;

    private LocalDateTime distributedAt;

}