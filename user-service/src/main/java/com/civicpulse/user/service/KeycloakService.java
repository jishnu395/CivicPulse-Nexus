package com.civicpulse.user.service;

import org.keycloak.representations.idm.UserRepresentation;

public interface KeycloakService {

    String createUser(String email, String password, String role);

    UserRepresentation getUserById(String userId);

    void deleteUser(String userId);
}