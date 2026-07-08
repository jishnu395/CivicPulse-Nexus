package com.civicpulse.grievance.controller;

import com.civicpulse.grievance.dto.CreateGrievanceRequest;
import com.civicpulse.grievance.dto.GrievanceResponse;
import com.civicpulse.grievance.dto.UpdateGrievanceRequest;
import com.civicpulse.grievance.service.interfaces.GrievanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
@RequiredArgsConstructor
public class GrievanceController {

    private final GrievanceService grievanceService;

    @PostMapping
    public ResponseEntity<GrievanceResponse> createGrievance(
            @Valid @RequestBody CreateGrievanceRequest request) {

        GrievanceResponse response = grievanceService.createGrievance(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GrievanceResponse>> getAllGrievances() {

        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrievanceResponse> getGrievanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(grievanceService.getGrievanceById(id));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<GrievanceResponse>> getGrievancesByCitizenId(
            @PathVariable Long citizenId) {

        return ResponseEntity.ok(
                grievanceService.getGrievancesByCitizenId(citizenId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrievanceResponse> updateGrievance(
            @PathVariable Long id,
            @RequestBody UpdateGrievanceRequest request) {

        return ResponseEntity.ok(
                grievanceService.updateGrievance(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGrievance(
            @PathVariable Long id) {

        grievanceService.deleteGrievance(id);

        return ResponseEntity.ok("Grievance deleted successfully.");
    }
}