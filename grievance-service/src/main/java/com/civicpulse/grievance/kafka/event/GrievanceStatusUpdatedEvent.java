package com.civicpulse.grievance.kafka.event;

import com.civicpulse.grievance.enums.GrievanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceStatusUpdatedEvent {

    private Long grievanceId;

    private GrievanceStatus status;

    private LocalDateTime updatedAt;

}