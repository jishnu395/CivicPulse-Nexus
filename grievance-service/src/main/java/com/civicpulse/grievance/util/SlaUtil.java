package com.civicpulse.grievance.util;

import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.Priority;
import com.civicpulse.grievance.enums.SLAStatus;

import java.time.LocalDateTime;

public class SlaUtil {

    private SlaUtil() {
    }

    public static LocalDateTime calculateDueDate(Priority priority) {

        LocalDateTime now = LocalDateTime.now();

        return switch (priority) {
            case HIGH -> now.plusDays(1);
            case MEDIUM -> now.plusDays(3);
            case LOW -> now.plusDays(7);
        };
    }

    public static SLAStatus calculateSlaStatus(
            LocalDateTime dueDate,
            GrievanceStatus grievanceStatus) {

        if (dueDate == null) {
            return SLAStatus.WITHIN_SLA;
        }

        if (grievanceStatus == GrievanceStatus.RESOLVED
                || grievanceStatus == GrievanceStatus.CLOSED) {
            return SLAStatus.WITHIN_SLA;
        }

        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(dueDate)) {
            return SLAStatus.OVERDUE;
        }

        if (now.plusHours(6).isAfter(dueDate)) {
            return SLAStatus.NEAR_DEADLINE;
        }

        return SLAStatus.WITHIN_SLA;
    }
}