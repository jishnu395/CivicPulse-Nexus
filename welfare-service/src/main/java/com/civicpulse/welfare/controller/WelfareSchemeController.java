package com.civicpulse.welfare.controller;

import com.civicpulse.welfare.dto.request.CreateSchemeRequest;
import com.civicpulse.welfare.dto.response.SchemeResponse;
import com.civicpulse.welfare.enums.SchemeStatus;
import com.civicpulse.welfare.service.WelfareSchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/welfare/schemes")
@RequiredArgsConstructor
public class WelfareSchemeController {

    private final WelfareSchemeService welfareSchemeService;

    @PostMapping
    public ResponseEntity<SchemeResponse> createScheme(
            @Valid @RequestBody CreateSchemeRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(welfareSchemeService.createScheme(request));
    }

    @GetMapping
    public ResponseEntity<List<SchemeResponse>> getAllSchemes() {

        return ResponseEntity.ok(
                welfareSchemeService.getAllSchemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getScheme(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                welfareSchemeService.getScheme(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchemeResponse> updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody CreateSchemeRequest request) {

        return ResponseEntity.ok(
                welfareSchemeService.updateScheme(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(
            @PathVariable Long id) {

        welfareSchemeService.deleteScheme(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SchemeResponse>> getSchemesByStatus(
            @PathVariable SchemeStatus status) {

        return ResponseEntity.ok(
                welfareSchemeService.getSchemesByStatus(status));
    }
}