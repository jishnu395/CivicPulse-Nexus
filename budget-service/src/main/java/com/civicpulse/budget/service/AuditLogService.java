package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.response.AuditLogResponse;

import java.util.List;

public interface AuditLogService {

    void log(String entityType,
             Long entityId,
             String action,
             String performedBy,
             String description);

    List<AuditLogResponse> getAll();

    AuditLogResponse getById(Long id);

    List<AuditLogResponse> getByEntity(String entityType);

}