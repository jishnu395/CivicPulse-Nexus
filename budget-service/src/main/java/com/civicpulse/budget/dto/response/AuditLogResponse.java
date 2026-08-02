package com.civicpulse.budget.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;

    private String entityType;

    private Long entityId;

    private String action;

    private String performedBy;

    private String description;

    private LocalDateTime timestamp;

}