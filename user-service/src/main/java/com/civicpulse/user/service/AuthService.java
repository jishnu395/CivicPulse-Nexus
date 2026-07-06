package com.civicpulse.user.service;

import com.civicpulse.user.dto.RegisterRequest;
import com.civicpulse.user.dto.RegisterResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    RegisterResponse register(RegisterRequest request);
}
