package com.civicpulse.grievance.dto.feign;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CitizenResponse {

    private Long id;

    private String citizenId;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String gender;

    private LocalDate dateOfBirth;

    private String address;

    private String wardNumber;

    private String city;

    private String state;

    private String postalCode;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}