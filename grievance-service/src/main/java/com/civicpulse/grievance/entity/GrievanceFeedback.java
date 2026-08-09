package com.civicpulse.grievance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_feedback")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long grievanceId;

    @Column(nullable = false)
    private Long citizenId;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(length = 1000)
    private String comments;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
