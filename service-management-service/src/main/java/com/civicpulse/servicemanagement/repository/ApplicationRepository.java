package com.civicpulse.servicemanagement.repository;

import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByApplicationNo(String applicationNo);

    List<Application> findByCitizenId(Long citizenId);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByStatusIn(List<ApplicationStatus> statuses);
}