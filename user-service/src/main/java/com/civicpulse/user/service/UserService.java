package com.civicpulse.user.service;

import com.civicpulse.user.dto.RegisterRequest;
import com.civicpulse.user.dto.RegisterResponse;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

}