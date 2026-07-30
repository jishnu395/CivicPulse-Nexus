package com.civicpulse.welfare.service.impl;

import com.civicpulse.welfare.dto.request.CreateSchemeRequest;
import com.civicpulse.welfare.dto.response.SchemeResponse;
import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.SchemeStatus;
import com.civicpulse.welfare.exception.ResourceNotFoundException;
import com.civicpulse.welfare.mapper.WelfareSchemeMapper;
import com.civicpulse.welfare.repository.WelfareSchemeRepository;
import com.civicpulse.welfare.service.WelfareSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WelfareSchemeServiceImpl implements WelfareSchemeService {

    private final WelfareSchemeRepository welfareSchemeRepository;
    private final WelfareSchemeMapper welfareSchemeMapper;

    @Override
    public SchemeResponse createScheme(CreateSchemeRequest request) {

        WelfareScheme scheme =
                welfareSchemeMapper.toEntity(request);

        WelfareScheme savedScheme =
                welfareSchemeRepository.save(scheme);

        return welfareSchemeMapper.toResponse(savedScheme);
    }

    @Override
    public List<SchemeResponse> getAllSchemes() {

        return welfareSchemeRepository.findAll()
                .stream()
                .map(welfareSchemeMapper::toResponse)
                .toList();
    }

    @Override
    public SchemeResponse getScheme(Long id) {

        WelfareScheme scheme =
                welfareSchemeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Scheme not found with id : " + id));

        return welfareSchemeMapper.toResponse(scheme);
    }

    @Override
    public SchemeResponse updateScheme(
            Long id,
            CreateSchemeRequest request) {

        WelfareScheme scheme =
                welfareSchemeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Scheme not found with id : " + id));

        scheme.setSchemeName(request.getSchemeName());
        scheme.setDescription(request.getDescription());
        scheme.setDepartment(request.getDepartment());
        scheme.setEligibilityCriteria(request.getEligibilityCriteria());
        scheme.setBenefitAmount(request.getBenefitAmount());
        scheme.setStatus(request.getStatus());
        scheme.setStartDate(request.getStartDate());
        scheme.setEndDate(request.getEndDate());

        WelfareScheme updatedScheme =
                welfareSchemeRepository.save(scheme);

        return welfareSchemeMapper.toResponse(updatedScheme);
    }

    @Override
    public void deleteScheme(Long id) {

        WelfareScheme scheme =
                welfareSchemeRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Scheme not found with id : " + id));

        welfareSchemeRepository.delete(scheme);
    }

    @Override
    public List<SchemeResponse> getSchemesByStatus(
            SchemeStatus status) {

        return welfareSchemeRepository.findByStatus(status)
                .stream()
                .map(welfareSchemeMapper::toResponse)
                .toList();
    }
}