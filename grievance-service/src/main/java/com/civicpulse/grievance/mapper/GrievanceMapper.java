package com.civicpulse.grievance.mapper;

import com.civicpulse.grievance.dto.GrievanceResponse;
import com.civicpulse.grievance.entity.Grievance;
import org.springframework.stereotype.Component;

@Component
public class GrievanceMapper {

    public GrievanceResponse toResponse(Grievance grievance) {

        GrievanceResponse response = new GrievanceResponse();

        response.setId(grievance.getId());
        response.setCitizenId(grievance.getCitizenId());
        response.setDepartmentId(grievance.getDepartmentId());
        response.setAssignedOfficerId(grievance.getAssignedOfficerId());
        response.setTitle(grievance.getTitle());
        response.setDescription(grievance.getDescription());
        response.setCategory(grievance.getCategory());
        response.setLocation(grievance.getLocation());
        response.setPriority(grievance.getPriority());
        response.setStatus(grievance.getStatus());
        response.setCreatedAt(grievance.getCreatedAt());
        response.setUpdatedAt(grievance.getUpdatedAt());
        response.setDueDate(grievance.getDueDate());
        response.setResolvedAt(grievance.getResolvedAt());

        return response;
    }
}