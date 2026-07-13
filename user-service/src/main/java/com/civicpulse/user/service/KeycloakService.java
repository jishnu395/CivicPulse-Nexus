package com.civicpulse.user.service;

import com.civicpulse.user.enums.Role;
import org.keycloak.representations.idm.UserRepresentation;

public interface KeycloakService {

    String createUser(String email, String password, Role role);

    UserRepresentation getUserById(String userId);

    void deleteUser(String userId);
}