package com.civicpulse.welfare.repository;

import com.civicpulse.welfare.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCitizenId(Long citizenId);

    List<Beneficiary> findBySchemeId(Long schemeId);

    boolean existsByCitizenId(Long citizenId);
}