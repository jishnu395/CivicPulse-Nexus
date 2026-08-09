package com.civicpulse.servicemanagement.repository;

import com.civicpulse.servicemanagement.entity.DownloadLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadLogRepository extends JpaRepository<DownloadLog, Long> {

    List<DownloadLog> findByApplicationId(Long applicationId);

    List<DownloadLog> findByCitizenId(Long citizenId);

    long countByItemType(String itemType);
}
