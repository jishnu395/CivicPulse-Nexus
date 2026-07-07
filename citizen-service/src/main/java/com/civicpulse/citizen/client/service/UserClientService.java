package com.civicpulse.citizen.client.service;

import com.civicpulse.citizen.dto.response.UserResponse;

public interface UserClientService {

    UserResponse getUser(Long id);

}