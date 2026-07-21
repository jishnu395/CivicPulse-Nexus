package com.civicpulse.grievance.service.impl;

import com.civicpulse.grievance.dto.*;
import com.civicpulse.grievance.entity.Grievance;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.SLAStatus;
import com.civicpulse.grievance.exception.GrievanceNotFoundException;
import com.civicpulse.grievance.exception.InvalidGrievanceStatusException;
import com.civicpulse.grievance.feign.CitizenClient;
import com.civicpulse.grievance.kafka.event.GrievanceAssignedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceStatusUpdatedEvent;
import com.civicpulse.grievance.kafka.producer.GrievanceEventProducer;
import com.civicpulse.grievance.mapper.GrievanceMapper;
import com.civicpulse.grievance.repository.GrievanceRepository;
import com.civicpulse.grievance.service.interfaces.GrievanceHistoryService;
import com.civicpulse.grievance.service.interfaces.GrievanceService;
import com.civicpulse.grievance.util.SlaUtil;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GrievanceServiceImpl implements GrievanceService {

    private static final Logger logger =
            LoggerFactory.getLogger(GrievanceServiceImpl.class);

    private final GrievanceRepository grievanceRepository;
    private final GrievanceMapper grievanceMapper;
    private final CitizenClient citizenClient;
    private final GrievanceEventProducer grievanceEventProducer;
    private final GrievanceHistoryService grievanceHistoryService;

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

        grievance.setDueDate(
                SlaUtil.calculateDueDate(request.getPriority()));

        grievance.setSlaStatus(
                SlaUtil.calculateSlaStatus(
                        grievance.getDueDate(),
                        grievance.getStatus()));

        Grievance saved = grievanceRepository.save(grievance);

        grievanceHistoryService.saveHistory(
                saved.getId(),
                GrievanceStatus.SUBMITTED,
                "Complaint submitted by citizen");

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
            logger.error("Failed to publish grievance created event", ex);
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
    @Transactional(readOnly = true)
    public List<GrievanceResponse> getMyGrievances(String email) {

        Long citizenId = citizenClient
                .getCitizenByEmail(email)
                .getId();

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
            grievance.setDueDate(
                    SlaUtil.calculateDueDate(request.getPriority()));

            grievance.setSlaStatus(
                    SlaUtil.calculateSlaStatus(
                            grievance.getDueDate(),
                            grievance.getStatus()));
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

    @Override
    public GrievanceResponse assignGrievance(Long grievanceId,
                                             AssignGrievanceRequest request) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() ->
                        new GrievanceNotFoundException(
                                "Grievance not found with id : " + grievanceId));

        if (grievance.getStatus() != GrievanceStatus.SUBMITTED) {
            throw new InvalidGrievanceStatusException(
                    "Only SUBMITTED grievances can be assigned.");
        }

        grievance.setDepartmentId(request.getDepartmentId());
        grievance.setAssignedOfficerId(request.getAssignedOfficerId());

        grievance.setStatus(GrievanceStatus.ASSIGNED);

        grievance.setSlaStatus(
                SlaUtil.calculateSlaStatus(
                        grievance.getDueDate(),
                        grievance.getStatus()));

        grievance.setUpdatedAt(LocalDateTime.now());

        Grievance updated = grievanceRepository.save(grievance);

        grievanceHistoryService.saveHistory(
                updated.getId(),
                GrievanceStatus.ASSIGNED,
                "Assigned to Department "
                        + updated.getDepartmentId()
                        + " | Officer "
                        + updated.getAssignedOfficerId());

        GrievanceAssignedEvent event = GrievanceAssignedEvent.builder()
                .grievanceId(updated.getId())
                .departmentId(updated.getDepartmentId())
                .assignedOfficerId(updated.getAssignedOfficerId())
                .assignedAt(LocalDateTime.now())
                .build();

        try {
            grievanceEventProducer.publishGrievanceAssignedEvent(event);
        } catch (Exception ex) {
            logger.error("Failed to publish grievance assigned event", ex);
        }

        return grievanceMapper.toResponse(updated);
    }

    @Override
    public GrievanceResponse updateGrievanceStatus(
            Long grievanceId,
            UpdateGrievanceStatusRequest request) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() ->
                        new GrievanceNotFoundException(
                                "Grievance not found with id : " + grievanceId));

        GrievanceStatus currentStatus = grievance.getStatus();
        GrievanceStatus newStatus = request.getStatus();

        boolean validTransition = switch (currentStatus) {

            case SUBMITTED ->
                    newStatus == GrievanceStatus.ASSIGNED;

            case UNDER_REVIEW ->
                    newStatus == GrievanceStatus.ASSIGNED
                            || newStatus == GrievanceStatus.REJECTED;

            case ASSIGNED ->
                    newStatus == GrievanceStatus.IN_PROGRESS;

            case IN_PROGRESS ->
                    newStatus == GrievanceStatus.PENDING
                            || newStatus == GrievanceStatus.RESOLVED
                            || newStatus == GrievanceStatus.ESCALATED;

            case PENDING ->
                    newStatus == GrievanceStatus.IN_PROGRESS
                            || newStatus == GrievanceStatus.RESOLVED;

            case ESCALATED ->
                    newStatus == GrievanceStatus.IN_PROGRESS
                            || newStatus == GrievanceStatus.RESOLVED;

            case RESOLVED ->
                    newStatus == GrievanceStatus.CLOSED;

            case REJECTED ->
                    false;

            case CLOSED ->
                    false;
        };

        if (!validTransition) {
            throw new InvalidGrievanceStatusException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus);
        }

        grievance.setStatus(newStatus);

        grievance.setSlaStatus(
                SlaUtil.calculateSlaStatus(
                        grievance.getDueDate(),
                        grievance.getStatus()));

        if (newStatus == GrievanceStatus.RESOLVED) {
            grievance.setResolvedAt(LocalDateTime.now());
        }

        grievance.setUpdatedAt(LocalDateTime.now());

        Grievance updated = grievanceRepository.save(grievance);

        grievanceHistoryService.saveHistory(
                updated.getId(),
                updated.getStatus(),
                "Status changed to " + updated.getStatus());

        GrievanceStatusUpdatedEvent event =
                GrievanceStatusUpdatedEvent.builder()
                        .grievanceId(updated.getId())
                        .status(updated.getStatus())
                        .updatedAt(updated.getUpdatedAt())
                        .build();

        try {
            grievanceEventProducer.publishGrievanceStatusUpdatedEvent(event);
        } catch (Exception ex) {
            logger.error("Failed to publish grievance status updated event", ex);
        }

        return grievanceMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public GrievanceDashboardResponse getDashboard() {

        GrievanceDashboardResponse response =
                new GrievanceDashboardResponse();

        response.setTotal(grievanceRepository.count());

        response.setSubmitted(
                grievanceRepository.countByStatus(
                        GrievanceStatus.SUBMITTED));

        response.setAssigned(
                grievanceRepository.countByStatus(
                        GrievanceStatus.ASSIGNED));

        response.setInProgress(
                grievanceRepository.countByStatus(
                        GrievanceStatus.IN_PROGRESS));

        response.setResolved(
                grievanceRepository.countByStatus(
                        GrievanceStatus.RESOLVED));

        response.setClosed(
                grievanceRepository.countByStatus(
                        GrievanceStatus.CLOSED));

        response.setEscalated(
                grievanceRepository.countByStatus(
                        GrievanceStatus.ESCALATED));

        response.setOverdue(
                grievanceRepository.countBySlaStatus(
                        SLAStatus.OVERDUE));

        return response;
    }

}