package com.civicpulse.grievance.service.impl;

import com.civicpulse.grievance.dto.CreateGrievanceRequest;
import com.civicpulse.grievance.dto.GrievanceResponse;
import com.civicpulse.grievance.dto.UpdateGrievanceRequest;
import com.civicpulse.grievance.entity.Grievance;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.exception.GrievanceNotFoundException;
import com.civicpulse.grievance.feign.CitizenClient;
import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import com.civicpulse.grievance.kafka.producer.GrievanceEventProducer;
import com.civicpulse.grievance.mapper.GrievanceMapper;
import com.civicpulse.grievance.repository.GrievanceRepository;
import com.civicpulse.grievance.service.interfaces.GrievanceService;
import com.civicpulse.grievance.util.SlaUtil;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GrievanceServiceImpl implements GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceMapper grievanceMapper;
    private final CitizenClient citizenClient;
    private final GrievanceEventProducer grievanceEventProducer;

    @Override
    public GrievanceResponse createGrievance(CreateGrievanceRequest request) {

        try {
            citizenClient.getCitizenById(request.getCitizenId());
        } catch (FeignException.NotFound ex) {
            throw new GrievanceNotFoundException(
                    "Citizen not found with id : " + request.getCitizenId());
        }

        Grievance grievance = new Grievance();

        grievance.setCitizenId(request.getCitizenId());
        grievance.setTitle(request.getTitle());
        grievance.setDescription(request.getDescription());
        grievance.setCategory(request.getCategory());
        grievance.setLocation(request.getLocation());
        grievance.setPriority(request.getPriority());

        grievance.setStatus(GrievanceStatus.SUBMITTED);

        LocalDateTime now = LocalDateTime.now();

        grievance.setCreatedAt(now);
        grievance.setUpdatedAt(now);
        grievance.setDueDate(SlaUtil.calculateDueDate(request.getPriority()));

        Grievance saved = grievanceRepository.save(grievance);

        GrievanceCreatedEvent event = GrievanceCreatedEvent.builder()
                .grievanceId(saved.getId())
                .citizenId(saved.getCitizenId())
                .title(saved.getTitle())
                .category(saved.getCategory())
                .priority(saved.getPriority())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();

        try {
            grievanceEventProducer.publishGrievanceCreatedEvent(event);
        } catch (Exception ex) {
            // TODO: Replace with proper logging (SLF4J) in production.
            ex.printStackTrace();
        }

        return grievanceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GrievanceResponse> getAllGrievances() {

        return grievanceRepository.findAll()
                .stream()
                .map(grievanceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GrievanceResponse getGrievanceById(Long id) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() ->
                        new GrievanceNotFoundException(
                                "Grievance not found with id : " + id));

        return grievanceMapper.toResponse(grievance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GrievanceResponse> getGrievancesByCitizenId(Long citizenId) {

        return grievanceRepository.findByCitizenId(citizenId)
                .stream()
                .map(grievanceMapper::toResponse)
                .toList();
    }

    @Override
    public GrievanceResponse updateGrievance(Long id,
                                             UpdateGrievanceRequest request) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() ->
                        new GrievanceNotFoundException(
                                "Grievance not found with id : " + id));

        if (request.getTitle() != null) {
            grievance.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            grievance.setDescription(request.getDescription());
        }

        if (request.getCategory() != null) {
            grievance.setCategory(request.getCategory());
        }

        if (request.getLocation() != null) {
            grievance.setLocation(request.getLocation());
        }

        if (request.getPriority() != null) {
            grievance.setPriority(request.getPriority());
            grievance.setDueDate(SlaUtil.calculateDueDate(request.getPriority()));
        }

        if (request.getDepartmentId() != null) {
            grievance.setDepartmentId(request.getDepartmentId());
        }

        if (request.getAssignedOfficerId() != null) {
            grievance.setAssignedOfficerId(request.getAssignedOfficerId());
        }

        if (request.getStatus() != null) {

            grievance.setStatus(request.getStatus());

            if (request.getStatus() == GrievanceStatus.RESOLVED) {
                grievance.setResolvedAt(LocalDateTime.now());
            }
        }

        grievance.setUpdatedAt(LocalDateTime.now());

        Grievance updated = grievanceRepository.save(grievance);

        return grievanceMapper.toResponse(updated);
    }

    @Override
    public void deleteGrievance(Long id) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() ->
                        new GrievanceNotFoundException(
                                "Grievance not found with id : " + id));

        grievanceRepository.delete(grievance);
    }
}