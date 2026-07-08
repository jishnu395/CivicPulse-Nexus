package com.civicpulse.grievance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignGrievanceRequest {

    @NotNull(message = "Department Id is required")
    private Long departmentId;

    @NotNull(message = "Assigned Officer Id is required")
    private Long assignedOfficerId;

}