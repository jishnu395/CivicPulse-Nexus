package com.civicpulse.citizen.repository;

import com.civicpulse.citizen.entity.Citizen;
import com.civicpulse.citizen.util.enums.CitizenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    Optional<Citizen> findByCitizenId(String citizenId);

    Optional<Citizen> findByUserId(Long userId);

    Optional<Citizen> findByEmail(String email);

    Optional<Citizen> findByPhoneNumber(String phoneNumber);

    List<Citizen> findByWardNumber(String wardNumber);

    List<Citizen> findByStatus(CitizenStatus status);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUserId(Long userId);
}