package com.civicpulse.servicemanagement.dto;

import com.civicpulse.servicemanagement.enums.PermitType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermitApplicationRequest {

    @NotNull
    private Long citizenId;

    @NotNull
    private PermitType permitType;
}