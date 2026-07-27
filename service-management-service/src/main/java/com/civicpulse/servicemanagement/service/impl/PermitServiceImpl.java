package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.PermitResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.Permit;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.mapper.PermitMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.PermitRepository;
import com.civicpulse.servicemanagement.service.PermitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermitServiceImpl implements PermitService {

    private final PermitRepository permitRepository;
    private final ApplicationRepository applicationRepository;
    private final PermitMapper permitMapper;
    private final ApplicationEventProducer eventProducer;

    @Override
    public PermitResponse generatePermit(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new BadRequestException(
                    "Application must be APPROVED before generating permit.");
        }

        if (application.getPermitType() == null) {
            throw new BadRequestException(
                    "This application is not a permit application.");
        }

        permitRepository.findByApplication_Id(applicationId)
                .ifPresent(p -> {
                    throw new BadRequestException(
                            "Permit already generated.");
                });

        String permitNo =
                "PERMIT-" +
                        LocalDateTime.now().getYear() +
                        "-" +
                        UUID.randomUUID().toString().substring(0,8).toUpperCase();

        Permit permit = Permit.builder()
                .permitNo(permitNo)
                .issueDate(LocalDateTime.now())
                .digitalSignature("DIGITAL-SIGNATURE")
                .pdfUrl("/permits/" + permitNo + ".pdf")
                .application(application)
                .build();

        Permit saved = permitRepository.save(permit);

        application.setStatus(ApplicationStatus.CERTIFICATE_GENERATED);

        applicationRepository.save(application);

        eventProducer.publish(
                "permit-generated",
                saved.getPermitNo()
        );

        return permitMapper.toResponse(saved);

    }

    @Override
    public PermitResponse downloadPermit(Long applicationId) {

        Permit permit = permitRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permit not found."));

        return permitMapper.toResponse(permit);

    }

    @Override
    public PermitResponse getPermit(Long applicationId) {

        Permit permit = permitRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permit not found."));

        return permitMapper.toResponse(permit);

    }

}