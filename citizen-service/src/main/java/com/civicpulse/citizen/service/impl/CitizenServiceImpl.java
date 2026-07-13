package com.civicpulse.citizen.service.impl;

import com.civicpulse.citizen.client.service.UserClientService;
import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.dto.response.UserResponse;
import com.civicpulse.citizen.entity.Citizen;
import com.civicpulse.citizen.event.CitizenCreatedEvent;
import com.civicpulse.citizen.exception.CitizenNotFoundException;
import com.civicpulse.citizen.exception.DuplicateCitizenException;
import com.civicpulse.citizen.mapper.CitizenMapper;
import com.civicpulse.citizen.producer.CitizenEventProducer;
import com.civicpulse.citizen.repository.CitizenRepository;
import com.civicpulse.citizen.service.interfaces.CitizenService;
import com.civicpulse.citizen.util.enums.CitizenStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CitizenServiceImpl implements CitizenService {

    private final CitizenRepository citizenRepository;
    private final CitizenMapper citizenMapper;
    private final UserClientService userClientService;
    private final CitizenEventProducer citizenEventProducer;

    @Override
    public CitizenResponse registerCitizen(CreateCitizenRequest request) {

        if (citizenRepository.existsByUserId(request.getUserId())) {
            throw new DuplicateCitizenException(
                    "Citizen profile already exists for user ID: " + request.getUserId()
            );
        }

        if (citizenRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateCitizenException(
                    "Phone number already exists: " + request.getPhoneNumber()
            );
        }

        UserResponse user = userClientService.getUser(request.getUserId());

        Citizen citizen = citizenMapper.toEntity(request, user.getEmail());

        Citizen savedCitizen = citizenRepository.save(citizen);

        CitizenCreatedEvent event = CitizenCreatedEvent.builder()
                .userId(savedCitizen.getUserId())
                .citizenId(savedCitizen.getCitizenId())
                .email(savedCitizen.getEmail())
                .firstName(savedCitizen.getFirstName())
                .lastName(savedCitizen.getLastName())
                .phoneNumber(savedCitizen.getPhoneNumber())
                .wardNumber(savedCitizen.getWardNumber())
                .createdAt(savedCitizen.getCreatedAt())
                .build();

        citizenEventProducer.publishCitizenCreatedEvent(event);

        return citizenMapper.toResponse(savedCitizen);
    }

    @Override
    public CitizenResponse getCitizenById(Long id) {

        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() ->
                        new CitizenNotFoundException(
                                "Citizen with ID " + id + " not found."
                        ));

        return citizenMapper.toResponse(citizen);
    }

    @Override
    public List<CitizenResponse> getAllCitizens() {

        return citizenRepository.findAll()
                .stream()
                .map(citizenMapper::toResponse)
                .toList();
    }

    @Override
    public CitizenResponse updateCitizen(Long id,
                                         UpdateCitizenRequest request) {

        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() ->
                        new CitizenNotFoundException(
                                "Citizen with ID " + id + " not found."
                        ));

        citizenMapper.updateEntity(citizen, request);

        Citizen updatedCitizen = citizenRepository.save(citizen);

        return citizenMapper.toResponse(updatedCitizen);
    }

    @Override
    public void deleteCitizen(Long id) {

        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() ->
                        new CitizenNotFoundException(
                                "Citizen with ID " + id + " not found."
                        ));

        citizen.setStatus(CitizenStatus.INACTIVE);
        citizenRepository.save(citizen);
    }

    @Override
    public List<CitizenResponse> getCitizensByWard(String wardNumber) {

        return citizenRepository.findByWardNumber(wardNumber)
                .stream()
                .map(citizenMapper::toResponse)
                .toList();
    }

    @Override
    public List<CitizenResponse> getCitizensByStatus(CitizenStatus status) {

        return citizenRepository.findByStatus(status)
                .stream()
                .map(citizenMapper::toResponse)
                .toList();
    }
}