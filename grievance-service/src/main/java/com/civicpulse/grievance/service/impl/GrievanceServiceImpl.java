package com.civicpulse.grievance.service.impl;

import com.civicpulse.grievance.dto.*;
import com.civicpulse.grievance.entity.Grievance;
import com.civicpulse.grievance.entity.GrievanceFeedback;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.Priority;
import com.civicpulse.grievance.enums.SLAStatus;
import com.civicpulse.grievance.exception.GrievanceNotFoundException;
import com.civicpulse.grievance.exception.InvalidGrievanceStatusException;
import com.civicpulse.grievance.feign.CitizenClient;
import com.civicpulse.grievance.kafka.event.GrievanceAssignedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceStatusUpdatedEvent;
import com.civicpulse.grievance.kafka.producer.GrievanceEventProducer;
import com.civicpulse.grievance.mapper.GrievanceMapper;
import com.civicpulse.grievance.repository.GrievanceFeedbackRepository;
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
import java.util.Objects;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GrievanceServiceImpl implements GrievanceService {

    private static final Logger logger =
            LoggerFactory.getLogger(GrievanceServiceImpl.class);

    private final GrievanceRepository grievanceRepository;
    private final GrievanceFeedbackRepository feedbackRepository;
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

        if (grievance.getStatus() == GrievanceStatus.RESOLVED ||
            grievance.getStatus() == GrievanceStatus.CLOSED ||
            grievance.getStatus() == GrievanceStatus.REJECTED) {
            throw new InvalidGrievanceStatusException(
                    "Cannot assign or reassign a " + grievance.getStatus() + " grievance.");
        }

        Long oldOfficerId = grievance.getAssignedOfficerId();
        Long oldDeptId = grievance.getDepartmentId();

        // No-op check: if target department and officer are identical to current, return existing response without updating history or publishing Kafka event
        if (Objects.equals(oldDeptId, request.getDepartmentId()) &&
            Objects.equals(oldOfficerId, request.getAssignedOfficerId())) {
            return grievanceMapper.toResponse(grievance);
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

        String historyDesc;
        if (oldOfficerId != null) {
            historyDesc = "Reassigned from Officer " + oldOfficerId + " to Officer " + updated.getAssignedOfficerId();
            if (oldDeptId != null && !oldDeptId.equals(updated.getDepartmentId())) {
                historyDesc += " (Department #" + oldDeptId + " -> #" + updated.getDepartmentId() + ")";
            }
        } else {
            historyDesc = "Assigned to Department #" + updated.getDepartmentId() + " | Officer #" + updated.getAssignedOfficerId();
        }

        grievanceHistoryService.saveHistory(
                updated.getId(),
                GrievanceStatus.ASSIGNED,
                historyDesc);

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

    @Override
    public FeedbackResponse submitFeedback(Long grievanceId, CreateFeedbackRequest request) {

        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new GrievanceNotFoundException("Grievance not found with id: " + grievanceId));

        if (grievance.getStatus() != GrievanceStatus.RESOLVED && grievance.getStatus() != GrievanceStatus.CLOSED) {
            throw new IllegalStateException("Feedback can only be submitted for RESOLVED or CLOSED grievances.");
        }

        if (feedbackRepository.existsByGrievanceId(grievanceId)) {
            throw new IllegalStateException("Feedback has already been submitted for this grievance.");
        }

        GrievanceFeedback feedback = GrievanceFeedback.builder()
                .grievanceId(grievanceId)
                .citizenId(request.getCitizenId())
                .rating(request.getRating())
                .comments(request.getComments())
                .createdAt(LocalDateTime.now())
                .build();

        GrievanceFeedback saved = feedbackRepository.save(feedback);

        return FeedbackResponse.builder()
                .id(saved.getId())
                .grievanceId(saved.getGrievanceId())
                .citizenId(saved.getCitizenId())
                .rating(saved.getRating())
                .comments(saved.getComments())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackResponse getFeedback(Long grievanceId) {
        GrievanceFeedback feedback = feedbackRepository.findByGrievanceId(grievanceId)
                .orElseThrow(() -> new GrievanceNotFoundException("No feedback found for grievance ID: " + grievanceId));

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .grievanceId(feedback.getGrievanceId())
                .citizenId(feedback.getCitizenId())
                .rating(feedback.getRating())
                .comments(feedback.getComments())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public GrievanceStatsResponse getGrievanceStats() {
        long total = grievanceRepository.count();
        long submitted = grievanceRepository.countByStatus(GrievanceStatus.SUBMITTED);
        long assigned = grievanceRepository.countByStatus(GrievanceStatus.ASSIGNED);
        long inProgress = grievanceRepository.countByStatus(GrievanceStatus.IN_PROGRESS);
        long pending = grievanceRepository.countByStatus(GrievanceStatus.PENDING);
        long resolved = grievanceRepository.countByStatus(GrievanceStatus.RESOLVED);
        long closed = grievanceRepository.countByStatus(GrievanceStatus.CLOSED);
        long escalated = grievanceRepository.countByStatus(GrievanceStatus.ESCALATED);
        long overdue = grievanceRepository.countBySlaStatus(SLAStatus.OVERDUE);

        double resolutionRate = 0.0;
        if (total > 0) {
            resolutionRate = Math.round(((double) (resolved + closed) / total) * 10000.0) / 100.0;
        }

        long withinSla = grievanceRepository.countBySlaStatus(SLAStatus.WITHIN_SLA);
        double slaRate = 0.0;
        if (total > 0) {
            slaRate = Math.round(((double) withinSla / total) * 10000.0) / 100.0;
        }

        Double avgRating = feedbackRepository.getAverageRating();
        double satisfactionScore = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
        long feedbackCount = feedbackRepository.count();

        List<Grievance> all = grievanceRepository.findAll();
        Map<String, Long> categoryMap = all.stream()
                .filter(g -> g.getCategory() != null)
                .collect(Collectors.groupingBy(Grievance::getCategory, Collectors.counting()));

        Map<String, Long> priorityMap = all.stream()
                .filter(g -> g.getPriority() != null)
                .collect(Collectors.groupingBy(g -> g.getPriority().name(), Collectors.counting()));

        return GrievanceStatsResponse.builder()
                .totalGrievances(total)
                .submitted(submitted)
                .assigned(assigned)
                .inProgress(inProgress)
                .pending(pending)
                .resolved(resolved)
                .closed(closed)
                .escalated(escalated)
                .overdue(overdue)
                .resolutionRate(resolutionRate)
                .slaComplianceRate(slaRate)
                .averageSatisfactionRating(satisfactionScore)
                .totalFeedbackCount(feedbackCount)
                .categoryDistribution(categoryMap)
                .priorityDistribution(priorityMap)
                .build();
    }
}