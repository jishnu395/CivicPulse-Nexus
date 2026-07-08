package com.civicpulse.grievance.util;

import com.civicpulse.grievance.enums.Priority;

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
}