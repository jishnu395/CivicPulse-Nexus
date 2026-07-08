package com.civicpulse.grievance.repository;

import com.civicpulse.grievance.entity.Grievance;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.SLAStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByCitizenId(Long citizenId);

    long countByStatus(GrievanceStatus status);

    long countBySlaStatus(SLAStatus slaStatus);

}