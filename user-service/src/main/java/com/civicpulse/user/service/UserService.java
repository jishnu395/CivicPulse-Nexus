package com.civicpulse.user.service;

import com.civicpulse.user.dto.RegisterResponse;

public interface UserService {

    RegisterResponse getUserById(Long id);

}