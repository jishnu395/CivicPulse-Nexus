package com.civicpulse.citizen.service.interfaces;

import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.util.enums.CitizenStatus;

import java.util.List;

public interface CitizenService {

    CitizenResponse registerCitizen(CreateCitizenRequest request);

    CitizenResponse getCitizenById(Long id);

    List<CitizenResponse> getAllCitizens();

    CitizenResponse updateCitizen(Long id,
                                  UpdateCitizenRequest request);

    void deleteCitizen(Long id);

    List<CitizenResponse> getCitizensByWard(String wardNumber);

    List<CitizenResponse> getCitizensByStatus(CitizenStatus status);

}