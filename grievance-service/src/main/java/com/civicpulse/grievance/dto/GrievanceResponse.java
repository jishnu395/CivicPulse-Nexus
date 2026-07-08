package com.civicpulse.grievance.dto;

import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.Priority;
import com.civicpulse.grievance.enums.SLAStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GrievanceResponse {

    private Long id;

    private Long citizenId;

    private Long departmentId;

    private Long assignedOfficerId;

    private String title;

    private String description;

    private String category;

    private String location;

    private Priority priority;

    private GrievanceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime dueDate;

    private LocalDateTime resolvedAt;

    private SLAStatus slaStatus;
}