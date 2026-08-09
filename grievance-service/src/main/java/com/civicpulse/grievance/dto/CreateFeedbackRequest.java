package com.civicpulse.grievance.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeedbackRequest {

    @NotNull(message = "Citizen ID is required")
    private Long citizenId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Minimum rating is 1")
    @Max(value = 5, message = "Maximum rating is 5")
    private Integer rating;

    private String comments;
}
