package com.civicpulse.citizen.repository;

import com.civicpulse.citizen.entity.Citizen;
import com.civicpulse.citizen.util.enums.CitizenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    long countByStatus(CitizenStatus status);

    @Query("SELECT c FROM Citizen c WHERE " +
            "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "c.phoneNumber LIKE CONCAT('%', :query, '%') OR " +
            "c.wardNumber LIKE CONCAT('%', :query, '%')")
    List<Citizen> searchCitizens(@Param("query") String query);
}