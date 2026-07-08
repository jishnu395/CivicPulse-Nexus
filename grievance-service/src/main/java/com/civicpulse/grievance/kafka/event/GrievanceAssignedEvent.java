package com.civicpulse.grievance.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceAssignedEvent {

    private Long grievanceId;

    private Long departmentId;

    private Long assignedOfficerId;

    private LocalDateTime assignedAt;

}