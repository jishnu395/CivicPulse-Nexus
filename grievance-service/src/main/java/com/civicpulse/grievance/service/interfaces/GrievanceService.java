package com.civicpulse.grievance.service.interfaces;

import com.civicpulse.grievance.dto.CreateGrievanceRequest;
import com.civicpulse.grievance.dto.GrievanceResponse;
import com.civicpulse.grievance.dto.UpdateGrievanceRequest;

import java.util.List;

public interface GrievanceService {

    GrievanceResponse createGrievance(CreateGrievanceRequest request);

    List<GrievanceResponse> getAllGrievances();

    GrievanceResponse getGrievanceById(Long id);

    List<GrievanceResponse> getGrievancesByCitizenId(Long citizenId);

    GrievanceResponse updateGrievance(Long id, UpdateGrievanceRequest request);

    void deleteGrievance(Long id);
}