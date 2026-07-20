package com.civicpulse.servicemanagement.repository;

import com.civicpulse.servicemanagement.entity.Document;
import com.civicpulse.servicemanagement.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByApplication_Id(Long applicationId);

    List<Document> findByVerificationStatus(VerificationStatus status);
}