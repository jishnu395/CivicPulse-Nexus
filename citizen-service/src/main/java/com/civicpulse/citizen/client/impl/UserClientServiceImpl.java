package com.civicpulse.citizen.client.impl;

import com.civicpulse.citizen.client.UserServiceClient;
import com.civicpulse.citizen.client.service.UserClientService;
import com.civicpulse.citizen.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserClientServiceImpl implements UserClientService {

    private final UserServiceClient userServiceClient;

    @Override
    public UserResponse getUser(Long id) {
        return userServiceClient.getUserById(id);
    }
}