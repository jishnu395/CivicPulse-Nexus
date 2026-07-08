package com.civicpulse.grievance.scheduler;

import com.civicpulse.grievance.entity.Grievance;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.enums.SLAStatus;
import com.civicpulse.grievance.kafka.event.GrievanceEscalatedEvent;
import com.civicpulse.grievance.kafka.producer.GrievanceEventProducer;
import com.civicpulse.grievance.repository.GrievanceRepository;
import com.civicpulse.grievance.service.interfaces.GrievanceHistoryService;
import com.civicpulse.grievance.util.SlaUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class EscalationScheduler {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceHistoryService grievanceHistoryService;
    private final GrievanceEventProducer grievanceEventProducer;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void escalateOverdueGrievances() {

        log.info("Escalation Scheduler Running...");

        List<Grievance> grievances = grievanceRepository.findAll();

        for (Grievance grievance : grievances) {

            SLAStatus slaStatus = SlaUtil.calculateSlaStatus(
                    grievance.getDueDate(),
                    grievance.getStatus());

            grievance.setSlaStatus(slaStatus);

            if (slaStatus == SLAStatus.OVERDUE
                    && grievance.getStatus() != GrievanceStatus.RESOLVED
                    && grievance.getStatus() != GrievanceStatus.CLOSED
                    && grievance.getStatus() != GrievanceStatus.ESCALATED) {

                grievance.setStatus(GrievanceStatus.ESCALATED);
                grievance.setUpdatedAt(LocalDateTime.now());

                grievanceRepository.save(grievance);

                grievanceHistoryService.saveHistory(
                        grievance.getId(),
                        GrievanceStatus.ESCALATED,
                        "Complaint automatically escalated due to SLA breach.");

                GrievanceEscalatedEvent event =
                        GrievanceEscalatedEvent.builder()
                                .grievanceId(grievance.getId())
                                .departmentId(grievance.getDepartmentId())
                                .assignedOfficerId(grievance.getAssignedOfficerId())
                                .escalatedAt(LocalDateTime.now())
                                .reason("SLA breached")
                                .build();

                grievanceEventProducer.publishGrievanceEscalatedEvent(event);

                log.info("Grievance {} escalated.", grievance.getId());
            }
        }
    }
}