package com.civicpulse.budget.service.impl;

import com.civicpulse.budget.dto.response.AuditLogResponse;
import com.civicpulse.budget.entity.AuditLog;
import com.civicpulse.budget.exception.ResourceNotFoundException;
import com.civicpulse.budget.mapper.AuditLogMapper;
import com.civicpulse.budget.repository.AuditLogRepository;
import com.civicpulse.budget.service.AuditLogService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository repository;
    private final AuditLogMapper mapper;

    @Override
    public void log(String entityType,
                    Long entityId,
                    String action,
                    String performedBy,
                    String description) {

        AuditLog audit = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(performedBy)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(audit);
    }

    @Override
    public List<AuditLogResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public AuditLogResponse getById(Long id) {

        return mapper.toResponse(
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Audit log not found."))
        );
    }

    @Override
    public List<AuditLogResponse> getByEntity(String entityType) {

        return repository.findByEntityType(entityType)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}