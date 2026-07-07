package com.civicpulse.citizen.mapper;

import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.entity.Citizen;
import org.springframework.stereotype.Component;

@Component
public class CitizenMapper {

    public Citizen toEntity(CreateCitizenRequest request, String email) {

        return Citizen.builder()
                .userId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(email)
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .wardNumber(request.getWardNumber())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .build();
    }

    public CitizenResponse toResponse(Citizen citizen) {

        return CitizenResponse.builder()
                .id(citizen.getId())
                .citizenId(citizen.getCitizenId())
                .userId(citizen.getUserId())
                .firstName(citizen.getFirstName())
                .lastName(citizen.getLastName())
                .email(citizen.getEmail())
                .phoneNumber(citizen.getPhoneNumber())
                .gender(citizen.getGender())
                .dateOfBirth(citizen.getDateOfBirth())
                .address(citizen.getAddress())
                .wardNumber(citizen.getWardNumber())
                .city(citizen.getCity())
                .state(citizen.getState())
                .postalCode(citizen.getPostalCode())
                .status(citizen.getStatus())
                .createdAt(citizen.getCreatedAt())
                .updatedAt(citizen.getUpdatedAt())
                .build();
    }

    public void updateEntity(Citizen citizen, UpdateCitizenRequest request) {

        citizen.setFirstName(request.getFirstName());
        citizen.setLastName(request.getLastName());
        citizen.setPhoneNumber(request.getPhoneNumber());
        citizen.setGender(request.getGender());
        citizen.setDateOfBirth(request.getDateOfBirth());
        citizen.setAddress(request.getAddress());
        citizen.setWardNumber(request.getWardNumber());
        citizen.setCity(request.getCity());
        citizen.setState(request.getState());
        citizen.setPostalCode(request.getPostalCode());
    }
}