package com.civicpulse.grievance.service.interfaces;

import com.civicpulse.grievance.dto.*;

import java.util.List;

public interface GrievanceService {

    GrievanceResponse createGrievance(CreateGrievanceRequest request);

    List<GrievanceResponse> getAllGrievances();

    GrievanceResponse getGrievanceById(Long id);

    List<GrievanceResponse> getGrievancesByCitizenId(Long citizenId);

    GrievanceResponse updateGrievance(Long id, UpdateGrievanceRequest request);

    GrievanceResponse updateGrievanceStatus(Long grievanceId, UpdateGrievanceStatusRequest request);

    void deleteGrievance(Long id);

    GrievanceResponse assignGrievance(Long grievanceId, AssignGrievanceRequest request);

    GrievanceDashboardResponse getDashboard();
}