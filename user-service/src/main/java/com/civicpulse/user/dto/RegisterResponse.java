package com.civicpulse.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterResponse {

    private Long id;

    private String email;

    private String role;

    private String message;
}