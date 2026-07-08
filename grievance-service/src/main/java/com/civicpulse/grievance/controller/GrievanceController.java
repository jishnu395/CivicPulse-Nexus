package com.civicpulse.grievance.controller;

import com.civicpulse.grievance.dto.CreateGrievanceRequest;
import com.civicpulse.grievance.dto.GrievanceResponse;
import com.civicpulse.grievance.dto.UpdateGrievanceRequest;
import com.civicpulse.grievance.service.interfaces.GrievanceService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Create a new grievance")
    @PostMapping
    public ResponseEntity<GrievanceResponse> createGrievance(
            @Valid @RequestBody CreateGrievanceRequest request) {

        GrievanceResponse response = grievanceService.createGrievance(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all grievances")
    @GetMapping
    public ResponseEntity<List<GrievanceResponse>> getAllGrievances() {

        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @Operation(summary = "Get grievance by ID")
    @GetMapping("/{id}")
    public ResponseEntity<GrievanceResponse> getGrievanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(grievanceService.getGrievanceById(id));
    }

    @Operation(summary = "Get grievances by Citizen ID")
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<GrievanceResponse>> getGrievancesByCitizenId(
            @PathVariable Long citizenId) {

        return ResponseEntity.ok(
                grievanceService.getGrievancesByCitizenId(citizenId));
    }

    @Operation(summary = "Update grievance")
    @PutMapping("/{id}")
    public ResponseEntity<GrievanceResponse> updateGrievance(
            @PathVariable Long id,
            @RequestBody UpdateGrievanceRequest request) {

        return ResponseEntity.ok(
                grievanceService.updateGrievance(id, request));
    }

    @Operation(summary = "Delete grievance")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrievance(
            @PathVariable Long id) {

        grievanceService.deleteGrievance(id);
        return ResponseEntity.ok("Grievance deleted successfully.");
    }
}