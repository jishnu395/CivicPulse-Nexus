package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.PermitResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.DownloadLog;
import com.civicpulse.servicemanagement.entity.Permit;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.mapper.PermitMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.DownloadLogRepository;
import com.civicpulse.servicemanagement.repository.PermitRepository;
import com.civicpulse.servicemanagement.service.PermitService;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermitServiceImpl implements PermitService {

    private final PermitRepository permitRepository;
    private final ApplicationRepository applicationRepository;
    private final DownloadLogRepository downloadLogRepository;
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
                        UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Permit permit = Permit.builder()
                .permitNo(permitNo)
                .issueDate(LocalDateTime.now())
                .digitalSignature("DIGITAL-SIGNATURE-VERIFIED-CIVICPULSE")
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

        downloadLogRepository.save(DownloadLog.builder()
                .itemType("PERMIT")
                .itemNumber(permit.getPermitNo())
                .applicationId(applicationId)
                .citizenId(permit.getApplication().getCitizenId())
                .downloadedAt(LocalDateTime.now())
                .build());

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

    @Override
    public byte[] downloadPermitPdf(Long applicationId) {

        Permit permit = permitRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Permit not found."));

        downloadLogRepository.save(DownloadLog.builder()
                .itemType("PERMIT")
                .itemNumber(permit.getPermitNo())
                .applicationId(applicationId)
                .citizenId(permit.getApplication().getCitizenId())
                .downloadedAt(LocalDateTime.now())
                .build());

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            Font title = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    20
            );

            document.add(new Paragraph("CIVICPULSE NEXUS", title));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("OFFICIAL MUNICIPAL PERMIT / LICENSE"));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Permit Number : " + permit.getPermitNo()));
            document.add(new Paragraph("Issue Date : " + permit.getIssueDate()));
            document.add(new Paragraph("Application ID : " + permit.getApplication().getId()));
            document.add(new Paragraph("Permit Type : " + permit.getApplication().getPermitType()));
            document.add(new Paragraph("Department : " + permit.getApplication().getDepartment()));
            document.add(new Paragraph("Citizen ID : " + permit.getApplication().getCitizenId()));
            document.add(new Paragraph("Fee Status : PAID ($" + permit.getApplication().getFeeAmount() + ")"));
            document.add(new Paragraph("Digital Signature : " + permit.getDigitalSignature()));

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}