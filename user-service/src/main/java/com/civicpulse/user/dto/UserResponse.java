package com.civicpulse.user.dto;

import com.civicpulse.user.enums.Role;
import com.civicpulse.user.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String email;

    private Role role;

    private UserStatus status;
}