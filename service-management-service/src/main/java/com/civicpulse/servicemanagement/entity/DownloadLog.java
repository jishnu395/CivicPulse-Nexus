package com.civicpulse.servicemanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "download_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemType; // "CERTIFICATE" or "PERMIT"

    @Column(nullable = false)
    private String itemNumber;

    @Column(nullable = false)
    private Long applicationId;

    private Long citizenId;

    @Column(nullable = false)
    private LocalDateTime downloadedAt;
}
