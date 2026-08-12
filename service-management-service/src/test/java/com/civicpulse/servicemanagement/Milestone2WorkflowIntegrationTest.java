package com.civicpulse.servicemanagement;

import com.civicpulse.servicemanagement.dto.*;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
import com.civicpulse.servicemanagement.enums.PermitType;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.repository.*;
import com.civicpulse.servicemanagement.service.ApplicationService;
import com.civicpulse.servicemanagement.service.CertificateService;
import com.civicpulse.servicemanagement.service.DocumentService;
import com.civicpulse.servicemanagement.service.OfficerService;
import com.civicpulse.servicemanagement.service.PermitService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class Milestone2WorkflowIntegrationTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private OfficerService officerService;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private PermitService permitService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private DownloadLogRepository downloadLogRepository;

    @MockitoBean
    private ApplicationEventProducer eventProducer;

    @Test
    @DisplayName("Complete Milestone 2 E2E Workflow: Certificate Lifecycle")
    void testCertificateEndToEndLifecycle() {
        Long testCitizenId = 101L;

        // 1. Citizen applies for a Birth Certificate
        ApplyCertificateRequest certReq = ApplyCertificateRequest.builder()
                .citizenId(testCitizenId)
                .certificateType(CertificateType.BIRTH_CERTIFICATE)
                .build();

        ApplicationResponse appResp = applicationService.applyCertificate(certReq);
        assertNotNull(appResp);
        assertNotNull(appResp.getId());
        assertNotNull(appResp.getApplicationNo());
        assertEquals(DepartmentType.MUNICIPALITY, appResp.getDepartment());
        assertEquals(ApplicationStatus.SUBMITTED, appResp.getStatus());
        assertEquals(testCitizenId, appResp.getCitizenId());
        Long appId = appResp.getId();

        // 2. Citizen uploads a supporting document (multipart)
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "hospital_birth_certificate.pdf",
                "application/pdf",
                "%PDF-1.4 sample municipal proof byte content".getBytes()
        );
        UploadDocumentResponse docResp = documentService.uploadDocument(appId, mockFile);
        assertNotNull(docResp);
        assertEquals("hospital_birth_certificate.pdf", docResp.getDocumentName());
        Long docId = docResp.getId();

        // 3. Query applications by citizen
        List<ApplicationResponse> citizenApps = applicationService.getApplicationsByCitizen(testCitizenId);
        assertTrue(citizenApps.stream().anyMatch(a -> a.getId().equals(appId)));

        // 4. Officer views pending applications
        List<ApplicationResponse> pending = officerService.getPendingApplications();
        assertTrue(pending.stream().anyMatch(a -> a.getId().equals(appId)));

        // 5. Officer inspects documents
        List<DocumentResponse> docs = officerService.getDocuments(appId);
        assertEquals(1, docs.size());
        assertEquals(docId, docs.get(0).getId());

        // 6. Officer verifies document
        DocumentVerificationRequest docVerifyReq = new DocumentVerificationRequest();
        docVerifyReq.setRemarks("Valid hospital seal and record number.");
        docVerifyReq.setVerified(true);
        ApplicationResponse afterDocVerify = officerService.verifyDocument(docId, docVerifyReq);
        assertNotNull(afterDocVerify);

        // 7. Officer verifies application
        VerifyDocumentRequest appVerifyReq = new VerifyDocumentRequest();
        appVerifyReq.setRemarks("All documents authenticated.");
        appVerifyReq.setVerified(true);
        ApplicationResponse afterAppVerify = officerService.verifyApplication(appId, appVerifyReq);
        assertEquals(ApplicationStatus.VERIFIED, afterAppVerify.getStatus());

        // 8. Officer / Commissioner approves application
        ApprovalRequest approvalReq = new ApprovalRequest();
        approvalReq.setRemarks("Approved by Municipal Authority.");
        ApplicationResponse afterApprove = officerService.approveApplication(appId, approvalReq);
        assertEquals(ApplicationStatus.APPROVED, afterApprove.getStatus());
        assertNotNull(afterApprove.getApprovalDate());

        // 9. Commissioner generates official certificate
        CertificateResponse certGenResp = certificateService.generateCertificate(appId);
        assertNotNull(certGenResp);
        assertNotNull(certGenResp.getCertificateNo());
        assertTrue(certGenResp.getCertificateNo().startsWith("CERT-"));
        assertEquals("DIGITAL-SIGNATURE-VERIFIED-CIVICPULSE", certGenResp.getDigitalSignature());
        assertNotNull(certGenResp.getIssueDate());

        // 10. Query certificate details
        CertificateResponse certDetails = certificateService.getCertificate(appId);
        assertEquals(certGenResp.getCertificateNo(), certDetails.getCertificateNo());

        // 11. Download certificate PDF binary stream
        byte[] pdfBytes = certificateService.downloadCertificatePdf(appId);
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 50);
        String header = new String(pdfBytes, 0, Math.min(pdfBytes.length, 10));
        assertTrue(header.contains("%PDF"), "Generated file must be a valid PDF");

        // 12. Verify persistence in Database
        Application persistedApp = applicationRepository.findById(appId).orElseThrow();
        assertEquals(ApplicationStatus.CERTIFICATE_GENERATED, persistedApp.getStatus());
        assertTrue(certificateRepository.findByApplication_Id(appId).isPresent());
        assertFalse(downloadLogRepository.findByApplicationId(appId).isEmpty());
        assertEquals("CERTIFICATE", downloadLogRepository.findByApplicationId(appId).get(0).getItemType());

        System.out.println(">>> Certificate E2E test passed successfully for appId=" + appId);
    }

    @Test
    @DisplayName("Complete Milestone 2 E2E Workflow: Permit Lifecycle")
    void testPermitEndToEndLifecycle() {
        Long testCitizenId = 102L;

        // 1. Citizen applies for a Trade License Permit
        PermitApplicationRequest permitReq = PermitApplicationRequest.builder()
                .citizenId(testCitizenId)
                .permitType(PermitType.TRADE_LICENSE)
                .build();

        ApplicationResponse appResp = applicationService.applyPermit(permitReq);
        assertNotNull(appResp);
        assertNotNull(appResp.getId());
        assertEquals(DepartmentType.MUNICIPALITY, appResp.getDepartment());
        assertEquals(ApplicationStatus.SUBMITTED, appResp.getStatus());
        Long appId = appResp.getId();

        // 2. Officer verifies and approves
        VerifyDocumentRequest appVerifyReq = new VerifyDocumentRequest();
        appVerifyReq.setRemarks("Site inspection completed.");
        appVerifyReq.setVerified(true);
        officerService.verifyApplication(appId, appVerifyReq);

        ApprovalRequest approvalReq = new ApprovalRequest();
        approvalReq.setRemarks("Trade permit sanctioned.");
        officerService.approveApplication(appId, approvalReq);

        // 3. Generate Permit
        PermitResponse permitResp = permitService.generatePermit(appId);
        assertNotNull(permitResp);
        assertNotNull(permitResp.getPermitNo());
        assertTrue(permitResp.getPermitNo().startsWith("PERMIT-"));
        assertEquals("DIGITAL-SIGNATURE-VERIFIED-CIVICPULSE", permitResp.getDigitalSignature());

        // 4. Download Permit PDF
        byte[] pdfBytes = permitService.downloadPermitPdf(appId);
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 50);
        String header = new String(pdfBytes, 0, Math.min(pdfBytes.length, 10));
        assertTrue(header.contains("%PDF"), "Generated permit file must be a valid PDF");

        // 5. Verify database persistence
        assertTrue(permitRepository.findByApplication_Id(appId).isPresent());
        System.out.println(">>> Permit E2E test passed successfully for appId=" + appId);
    }

    @Test
    @DisplayName("Rejection Flow Verification")
    void testRejectionLifecycle() {
        Long testCitizenId = 103L;

        ApplyCertificateRequest certReq = ApplyCertificateRequest.builder()
                .citizenId(testCitizenId)
                .certificateType(CertificateType.INCOME_CERTIFICATE)
                .build();

        ApplicationResponse appResp = applicationService.applyCertificate(certReq);
        Long appId = appResp.getId();

        ApprovalRequest rejectReq = new ApprovalRequest();
        rejectReq.setRemarks("Income proof invalid.");
        ApplicationResponse afterReject = officerService.rejectApplication(appId, rejectReq);
        assertEquals(ApplicationStatus.REJECTED, afterReject.getStatus());

        // Re-read from repository
        Application persisted = applicationRepository.findById(appId).orElseThrow();
        assertEquals(ApplicationStatus.REJECTED, persisted.getStatus());
        assertEquals("Income proof invalid.", persisted.getRemarks());
        System.out.println(">>> Rejection test passed successfully for appId=" + appId);
    }
}
