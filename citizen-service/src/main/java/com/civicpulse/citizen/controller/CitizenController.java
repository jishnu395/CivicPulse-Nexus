package com.civicpulse.citizen.controller;

import com.civicpulse.citizen.dto.request.CreateCitizenRequest;
import com.civicpulse.citizen.dto.request.UpdateCitizenRequest;
import com.civicpulse.citizen.dto.response.CitizenResponse;
import com.civicpulse.citizen.service.interfaces.CitizenService;
import com.civicpulse.citizen.util.enums.CitizenStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizens")
@RequiredArgsConstructor
@Tag(
        name = "Citizen Management",
        description = "APIs for managing citizen profiles in CivicPulse Nexus"
)
public class CitizenController {

    private final CitizenService citizenService;

    @Operation(
            summary = "Register a new citizen",
            description = "Creates a citizen profile linked to an existing registered user."
    )
    @ApiResponse(responseCode = "201", description = "Citizen registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @ApiResponse(responseCode = "409", description = "Citizen already exists")
    @PostMapping
    public ResponseEntity<CitizenResponse> registerCitizen(
            @Valid @RequestBody CreateCitizenRequest request) {

        CitizenResponse response = citizenService.registerCitizen(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @Operation(
            summary = "Get citizen by ID",
            description = "Retrieves a citizen profile using its database ID."
    )
    @ApiResponse(responseCode = "200", description = "Citizen found")
    @ApiResponse(responseCode = "404", description = "Citizen not found")
    @GetMapping("/{id}")
    public ResponseEntity<CitizenResponse> getCitizenById(
            @Parameter(description = "Citizen database ID")
            @PathVariable Long id) {

        return ResponseEntity.ok(
                citizenService.getCitizenById(id));
    }

    @Operation(
            summary = "Get all citizens",
            description = "Returns a list of all registered citizens."
    )
    @ApiResponse(responseCode = "200", description = "Citizens retrieved successfully")
    @GetMapping
    public ResponseEntity<List<CitizenResponse>> getAllCitizens() {

        return ResponseEntity.ok(
                citizenService.getAllCitizens());
    }

    @Operation(
            summary = "Update citizen",
            description = "Updates an existing citizen profile."
    )
    @ApiResponse(responseCode = "200", description = "Citizen updated successfully")
    @ApiResponse(responseCode = "404", description = "Citizen not found")
    @PutMapping("/{id}")
    public ResponseEntity<CitizenResponse> updateCitizen(
            @Parameter(description = "Citizen database ID")
            @PathVariable Long id,
            @Valid @RequestBody UpdateCitizenRequest request) {

        return ResponseEntity.ok(
                citizenService.updateCitizen(id, request));
    }

    @Operation(
            summary = "Delete citizen",
            description = "Deletes a citizen profile."
    )
    @ApiResponse(responseCode = "204", description = "Citizen deleted successfully")
    @ApiResponse(responseCode = "404", description = "Citizen not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCitizen(
            @Parameter(description = "Citizen database ID")
            @PathVariable Long id) {

        citizenService.deleteCitizen(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Get citizens by ward",
            description = "Returns all citizens belonging to a ward."
    )
    @ApiResponse(responseCode = "200", description = "Citizens retrieved successfully")
    @GetMapping("/ward/{wardNumber}")
    public ResponseEntity<List<CitizenResponse>> getCitizensByWard(
            @Parameter(description = "Ward number")
            @PathVariable String wardNumber) {

        return ResponseEntity.ok(
                citizenService.getCitizensByWard(wardNumber));
    }

    @Operation(
            summary = "Get citizens by status",
            description = "Returns all citizens filtered by status."
    )
    @ApiResponse(responseCode = "200", description = "Citizens retrieved successfully")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CitizenResponse>> getCitizensByStatus(
            @Parameter(description = "Citizen status (ACTIVE, INACTIVE)")
            @PathVariable CitizenStatus status) {

        return ResponseEntity.ok(
                citizenService.getCitizensByStatus(status));
    }
}