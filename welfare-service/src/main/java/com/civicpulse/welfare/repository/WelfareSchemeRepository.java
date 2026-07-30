package com.civicpulse.welfare.repository;

import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.SchemeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WelfareSchemeRepository extends JpaRepository<WelfareScheme, Long> {

    List<WelfareScheme> findByStatus(SchemeStatus status);

}