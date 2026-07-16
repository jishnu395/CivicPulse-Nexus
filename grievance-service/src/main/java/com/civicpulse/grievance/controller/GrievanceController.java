package com.civicpulse.grievance.controller;

import com.civicpulse.grievance.dto.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.civicpulse.grievance.service.interfaces.GrievanceHistoryService;
import com.civicpulse.grievance.service.interfaces.GrievanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@EnableFeignClients
@RestController
@RequestMapping("/api/grievances")
@RequiredArgsConstructor
@Tag(
        name = "Grievance Controller",
        description = "REST APIs for Grievance Management"
)
public class GrievanceController {

    private final GrievanceService grievanceService;
    private final GrievanceHistoryService grievanceHistoryService;

    @Operation(summary = "Create a new grievance")
    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping
    public ResponseEntity<GrievanceResponse> createGrievance(
            @Valid @RequestBody CreateGrievanceRequest request) {

        GrievanceResponse response = grievanceService.createGrievance(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all grievances")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER','COMMISSIONER','CITIZEN')")
    @GetMapping
    public ResponseEntity<List<GrievanceResponse>> getAllGrievances() {

        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @Operation(summary = "Get grievance by ID")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER','COMMISSIONER','CITIZEN')")
    @GetMapping("/{id}")
    public ResponseEntity<GrievanceResponse> getGrievanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(grievanceService.getGrievanceById(id));
    }

    @Operation(summary = "Get grievances by Citizen ID")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER','COMMISSIONER','CITIZEN')")
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<GrievanceResponse>> getGrievancesByCitizenId(
            @PathVariable Long citizenId) {

        return ResponseEntity.ok(
                grievanceService.getGrievancesByCitizenId(citizenId));
    }

    @Operation(summary = "Update grievance")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    @PutMapping("/{id}")
    public ResponseEntity<GrievanceResponse> updateGrievance(
            @PathVariable Long id,
            @RequestBody UpdateGrievanceRequest request) {

        return ResponseEntity.ok(
                grievanceService.updateGrievance(id, request));
    }

    @Operation(summary = "Delete grievance")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrievance(
            @PathVariable Long id) {

        grievanceService.deleteGrievance(id);
        return ResponseEntity.ok("Grievance deleted successfully.");
    }

    @Operation(
            summary = "Assign grievance",
            description = "Assigns a grievance to a department and officer."
    )
    @ApiResponse(responseCode = "200", description = "Grievance assigned successfully")
    @ApiResponse(responseCode = "404", description = "Grievance not found")
    @PreAuthorize("hasAnyRole('ADMIN','COMMISSIONER')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<GrievanceResponse> assignGrievance(
            @PathVariable Long id,
            @Valid @RequestBody AssignGrievanceRequest request) {

        return ResponseEntity.ok(
                grievanceService.assignGrievance(id, request));
    }

    @Operation(
            summary = "Update grievance status",
            description = "Updates grievance workflow status."
    )
    @ApiResponse(responseCode = "200", description = "Status updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid status transition")
    @ApiResponse(responseCode = "404", description = "Grievance not found")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER','COMMISSIONER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<GrievanceResponse> updateGrievanceStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGrievanceStatusRequest request) {

        return ResponseEntity.ok(
                grievanceService.updateGrievanceStatus(id, request));
    }

    @Operation(
            summary = "Get grievance history",
            description = "Returns the complete history timeline of a grievance."
    )
    @ApiResponse(responseCode = "200", description = "History retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Grievance not found")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER','COMMISSIONER','CITIZEN')")
    @GetMapping("/{id}/history")
    public ResponseEntity<List<GrievanceHistoryResponse>> getGrievanceHistory(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                grievanceHistoryService.getHistoryByGrievanceId(id));
    }

    @Operation(summary = "Dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','COMMISSIONER')")
    @GetMapping("/dashboard")
    public ResponseEntity<GrievanceDashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                grievanceService.getDashboard());
    }
}