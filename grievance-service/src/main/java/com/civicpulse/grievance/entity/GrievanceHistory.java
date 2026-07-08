package com.civicpulse.grievance.entity;

import com.civicpulse.grievance.enums.GrievanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrievanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long grievanceId;

    @Enumerated(EnumType.STRING)
    private GrievanceStatus status;

    @Column(length = 500)
    private String remarks;

    private LocalDateTime updatedAt;
}