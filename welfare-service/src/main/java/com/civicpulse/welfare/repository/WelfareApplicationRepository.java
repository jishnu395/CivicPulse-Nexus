package com.civicpulse.welfare.repository;

import com.civicpulse.welfare.entity.WelfareApplication;
import com.civicpulse.welfare.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WelfareApplicationRepository
        extends JpaRepository<WelfareApplication, Long> {

    List<WelfareApplication> findByCitizenId(Long citizenId);

    List<WelfareApplication> findByStatus(ApplicationStatus status);
}