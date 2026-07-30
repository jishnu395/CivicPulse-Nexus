package com.civicpulse.welfare.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBeneficiaryRequest {

    @NotNull
    private Long applicationId;
}