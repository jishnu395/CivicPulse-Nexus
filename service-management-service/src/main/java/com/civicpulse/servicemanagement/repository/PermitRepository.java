package com.civicpulse.servicemanagement.repository;

import com.civicpulse.servicemanagement.entity.Permit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermitRepository extends JpaRepository<Permit, Long> {

    Optional<Permit> findByPermitNo(String permitNo);

    Optional<Permit> findByApplication_Id(Long applicationId);

}