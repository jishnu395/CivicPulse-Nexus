package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.response.AuditLogResponse;
import com.civicpulse.budget.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public List<AuditLogResponse> getAll() {
        return auditLogService.getAll();
    }

    @GetMapping("/{id}")
    public AuditLogResponse getById(@PathVariable Long id) {
        return auditLogService.getById(id);
    }

    @GetMapping("/entity/{entityType}")
    public List<AuditLogResponse> getByEntity(
            @PathVariable String entityType) {

        return auditLogService.getByEntity(entityType);
    }
}