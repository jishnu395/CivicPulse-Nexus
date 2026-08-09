package com.civicpulse.reporting.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenReportDTO {
    private long totalCitizens;
    private long activeCitizens;
    private long inactiveCitizens;
    private Map<String, Long> wardDistribution;
    private LocalDateTime generatedAt;
}
