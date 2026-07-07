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
public class CitizenCreatedEvent {

    private Long userId;

    private String citizenId;

    private String email;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private String wardNumber;

    private LocalDateTime createdAt;
}