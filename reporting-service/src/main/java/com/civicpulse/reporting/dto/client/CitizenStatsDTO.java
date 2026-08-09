package com.civicpulse.reporting.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenStatsDTO {
    private long totalCitizens;
    private long activeCitizens;
    private long inactiveCitizens;
    private Map<String, Long> wardDistribution;
}
