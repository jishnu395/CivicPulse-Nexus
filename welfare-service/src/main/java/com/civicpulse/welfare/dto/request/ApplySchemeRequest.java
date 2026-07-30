package com.civicpulse.welfare.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplySchemeRequest {

    @NotNull
    private Long citizenId;

    @NotNull
    private Long schemeId;
}