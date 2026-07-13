package com.civicpulse.user.service;

import com.civicpulse.user.dto.UpdateUserRequest;
import com.civicpulse.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);
}