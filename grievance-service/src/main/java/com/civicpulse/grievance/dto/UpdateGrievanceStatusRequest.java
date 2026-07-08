package com.civicpulse.grievance.dto;

import com.civicpulse.grievance.enums.GrievanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateGrievanceStatusRequest {

    @NotNull(message = "Status is required")
    private GrievanceStatus status;

}