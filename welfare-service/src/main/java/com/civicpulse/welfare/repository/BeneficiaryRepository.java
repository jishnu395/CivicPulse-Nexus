package com.civicpulse.welfare.repository;

import com.civicpulse.welfare.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCitizenId(Long citizenId);

    List<Beneficiary> findBySchemeId(Long schemeId);

    boolean existsByCitizenId(Long citizenId);

    boolean existsByCitizenIdAndSchemeId(Long citizenId, Long schemeId);
}