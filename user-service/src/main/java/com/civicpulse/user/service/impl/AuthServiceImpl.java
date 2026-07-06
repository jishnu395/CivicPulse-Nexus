package com.civicpulse.user.service.impl;

import com.civicpulse.user.dto.RegisterRequest;
import com.civicpulse.user.dto.RegisterResponse;
import com.civicpulse.user.entity.User;
import com.civicpulse.user.repository.UserRepository;
import com.civicpulse.user.service.AuthService;
import com.civicpulse.user.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        try {

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            String keycloakId = keycloakService.createUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()
            );

            User user = User.builder()
                    .email(request.getEmail())
                    .keycloakId(keycloakId)
                    .role(request.getRole())
                    .status("ACTIVE")
                    .build();

            User savedUser = userRepository.save(user);

            return RegisterResponse.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole())
                    .message("User registered successfully")
                    .build();

        } catch (Exception e) {
            System.out.println("========== AUTH SERVICE EXCEPTION ==========");
            e.printStackTrace();
            throw e;
        }
    }
}