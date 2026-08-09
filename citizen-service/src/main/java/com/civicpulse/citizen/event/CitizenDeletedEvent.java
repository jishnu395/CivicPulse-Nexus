package com.civicpulse.citizen.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenDeletedEvent {

    private Long id;
    private Long userId;
    private String citizenId;
    private LocalDateTime deletedAt;
}
