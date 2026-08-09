package com.civicpulse.citizen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenStatsResponse {

    private long totalCitizens;
    private long activeCitizens;
    private long inactiveCitizens;
    private Map<String, Long> wardDistribution;
}
