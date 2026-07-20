package com.civicpulse.user.service.impl;

import com.civicpulse.user.dto.*;
import com.civicpulse.user.entity.User;
import com.civicpulse.user.enums.UserStatus;
import com.civicpulse.user.repository.UserRepository;
import com.civicpulse.user.service.AuthService;
import com.civicpulse.user.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import com.civicpulse.user.dto.KeycloakTokenResponse;
import com.civicpulse.user.dto.LoginRequest;
import com.civicpulse.user.dto.LoginResponse;
import org.springframework.http.MediaType;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final RestClient restClient;

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        try {

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            String keycloakId = keycloakService.createUser(
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()
            );

            User user = User.builder()
                    .email(request.getEmail())
                    .keycloakId(keycloakId)
                    .role(request.getRole())
                    .status(UserStatus.ACTIVE)
                    .build();

            User savedUser = userRepository.save(user);

            return RegisterResponse.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole())
                    .status(savedUser.getStatus())
                    .message("User registered successfully")
                    .build();

        } catch (Exception e) {
            System.out.println("========== AUTH SERVICE EXCEPTION ==========");
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("username", request.getEmail());
        formData.add("password", request.getPassword());

        String tokenUrl = serverUrl
                + "/realms/"
                + realm
                + "/protocol/openid-connect/token";

        KeycloakTokenResponse tokenResponse = restClient.post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(KeycloakTokenResponse.class);

        return LoginResponse.builder()
                .accessToken(tokenResponse.getAccessToken())
                .refreshToken(tokenResponse.getRefreshToken())
                .expiresIn(tokenResponse.getExpiresIn())
                .tokenType(tokenResponse.getTokenType())
                .build();
    }
}