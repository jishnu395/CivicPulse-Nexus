package com.civicpulse.servicemanagement.repository;

import com.civicpulse.servicemanagement.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateNo(String certificateNo);

    Optional<Certificate> findByApplication_Id(Long applicationId);
}