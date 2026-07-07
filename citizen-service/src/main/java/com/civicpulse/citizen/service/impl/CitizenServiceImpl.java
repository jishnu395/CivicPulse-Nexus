package com.civicpulse.citizen.service.impl;

import com.civicpulse.citizen.client.service.UserClientService;
import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.dto.response.UserResponse;
import com.civicpulse.citizen.entity.Citizen;
import com.civicpulse.citizen.mapper.CitizenMapper;
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

    @Override
    public CitizenResponse registerCitizen(CreateCitizenRequest request) {

        if (citizenRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("Citizen profile already exists for this user.");
        }

        if (citizenRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists.");
        }

        UserResponse user = userClientService.getUser(request.getUserId());

        Citizen citizen = citizenMapper.toEntity(request, user.getEmail());

        Citizen savedCitizen = citizenRepository.save(citizen);

        return citizenMapper.toResponse(savedCitizen);
    }

    @Override
    public CitizenResponse getCitizenById(Long id) {

        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen not found."));

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
                .orElseThrow(() -> new RuntimeException("Citizen not found."));

        citizenMapper.updateEntity(citizen, request);

        Citizen updatedCitizen = citizenRepository.save(citizen);

        return citizenMapper.toResponse(updatedCitizen);
    }

    @Override
    public void deleteCitizen(Long id) {

        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen not found."));

        citizenRepository.delete(citizen);
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