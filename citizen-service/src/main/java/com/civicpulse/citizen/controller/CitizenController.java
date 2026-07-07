package com.civicpulse.citizen.controller;

import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.service.interfaces.CitizenService;
import com.civicpulse.citizen.util.enums.CitizenStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
public class CitizenController {

    private final CitizenService citizenService;

    @PostMapping
    public ResponseEntity<CitizenResponse> registerCitizen(
            @Valid @RequestBody CreateCitizenRequest request) {

        CitizenResponse response = citizenService.registerCitizen(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitizenResponse> getCitizenById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                citizenService.getCitizenById(id));
    }

    @GetMapping
    public ResponseEntity<List<CitizenResponse>> getAllCitizens() {

        return ResponseEntity.ok(
                citizenService.getAllCitizens());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CitizenResponse> updateCitizen(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCitizenRequest request) {

        return ResponseEntity.ok(
                citizenService.updateCitizen(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCitizen(
            @PathVariable Long id) {

        citizenService.deleteCitizen(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ward/{wardNumber}")
    public ResponseEntity<List<CitizenResponse>> getCitizensByWard(
            @PathVariable String wardNumber) {

        return ResponseEntity.ok(
                citizenService.getCitizensByWard(wardNumber));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CitizenResponse>> getCitizensByStatus(
            @PathVariable CitizenStatus status) {

        return ResponseEntity.ok(
                citizenService.getCitizensByStatus(status));
    }
}