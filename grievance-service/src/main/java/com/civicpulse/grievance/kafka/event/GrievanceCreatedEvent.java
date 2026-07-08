package com.civicpulse.grievance.kafka.event;

import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceCreatedEvent {

    private Long grievanceId;

    private Long citizenId;

    private String title;

    private String category;

    private Priority priority;

    private GrievanceStatus status;

    private LocalDateTime createdAt;

}