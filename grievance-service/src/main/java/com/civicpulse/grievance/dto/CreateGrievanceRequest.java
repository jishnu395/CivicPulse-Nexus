package com.civicpulse.grievance.dto;

import com.civicpulse.grievance.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateGrievanceRequest {

    @NotNull(message = "Citizen ID is required")
    private Long citizenId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Priority is required")
    private Priority priority;
}