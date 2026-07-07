package com.civicpulse.citizen.dto.response;

import lombok.Data;

@Data
public class UserResponse {

    private Long id;

    private String email;

    private String role;

    private String status;
}