package com.civicpulse.user.service.impl;

import com.civicpulse.user.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakServiceImpl implements KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Override
    public String createUser(String email, String password, String role) {

        try {

            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setUsername(email);
            user.setEmail(email);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(false);

            user.setCredentials(List.of(credential));

            Response response = keycloak.realm(realm)
                    .users()
                    .create(user);

            System.out.println("========== KEYCLOAK RESPONSE ==========");
            System.out.println("Status : " + response.getStatus());

            if (response.getStatus() != 201) {
                String error = response.readEntity(String.class);
                System.out.println("Error Body : " + error);
                throw new RuntimeException(
                        "Failed to create user in Keycloak. Status = "
                                + response.getStatus()
                                + ", Error = "
                                + error
                );
            }

            String location = response.getLocation().getPath();
            String userId = location.substring(location.lastIndexOf("/") + 1);

            System.out.println("User created successfully!");
            System.out.println("Keycloak User ID : " + userId);

            return userId;

        } catch (Exception e) {
            System.out.println("========== KEYCLOAK EXCEPTION ==========");
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public UserRepresentation getUserById(String userId) {
        return keycloak.realm(realm)
                .users()
                .get(userId)
                .toRepresentation();
    }

    @Override
    public void deleteUser(String userId) {
        keycloak.realm(realm)
                .users()
                .delete(userId);
    }
}