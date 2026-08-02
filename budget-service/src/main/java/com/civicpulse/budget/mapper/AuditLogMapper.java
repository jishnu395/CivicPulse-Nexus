package com.civicpulse.budget.mapper;

import com.civicpulse.budget.dto.response.AuditLogResponse;
import com.civicpulse.budget.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(AuditLog log){

        return AuditLogResponse.builder()
                .id(log.getId())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .action(log.getAction())
                .performedBy(log.getPerformedBy())
                .description(log.getDescription())
                .timestamp(log.getTimestamp())
                .build();
    }

}