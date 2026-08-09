package com.civicpulse.grievance.repository;

import com.civicpulse.grievance.entity.GrievanceFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrievanceFeedbackRepository extends JpaRepository<GrievanceFeedback, Long> {

    Optional<GrievanceFeedback> findByGrievanceId(Long grievanceId);

    boolean existsByGrievanceId(Long grievanceId);

    @Query("SELECT AVG(f.rating) FROM GrievanceFeedback f")
    Double getAverageRating();
}
