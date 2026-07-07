package com.civicpulse.citizen.dto.response;

import com.civicpulse.citizen.util.enums.CitizenStatus;
import com.civicpulse.citizen.util.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CitizenResponse {

    private Long id;

    private String citizenId;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String address;

    private String wardNumber;

    private String city;

    private String state;

    private String postalCode;

    private CitizenStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}