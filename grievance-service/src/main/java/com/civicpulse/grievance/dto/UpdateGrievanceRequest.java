package com.civicpulse.grievance.dto;

import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.Priority;
import lombok.Data;

@Data
public class UpdateGrievanceRequest {

    private String title;

    private String description;

    private String category;

    private String location;

    private Priority priority;

    private GrievanceStatus status;

    private Long assignedOfficerId;

    private Long departmentId;
}