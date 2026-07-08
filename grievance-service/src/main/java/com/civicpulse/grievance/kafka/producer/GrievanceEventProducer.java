package com.civicpulse.grievance.kafka.producer;

import com.civicpulse.grievance.kafka.event.GrievanceAssignedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceEscalatedEvent;
import com.civicpulse.grievance.kafka.event.GrievanceStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GrievanceEventProducer {

    private static final String TOPIC = "grievance-created";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String ESCALATED_TOPIC = "grievance-escalated";
    public void publishGrievanceEscalatedEvent(
            GrievanceEscalatedEvent event) {

        kafkaTemplate.send(
                ESCALATED_TOPIC,
                event.getGrievanceId().toString(),
                event
        );
    }

    public void publishGrievanceCreatedEvent(GrievanceCreatedEvent event) {

        kafkaTemplate.send(
                TOPIC,
                event.getGrievanceId().toString(),
                event
        );
    }

    private static final String ASSIGNED_TOPIC = "grievance-assigned";

    public void publishGrievanceAssignedEvent(GrievanceAssignedEvent event) {

        kafkaTemplate.send(
                ASSIGNED_TOPIC,
                event.getGrievanceId().toString(),
                event
        );
    }

    private static final String STATUS_UPDATED_TOPIC = "grievance-status-updated";

    public void publishGrievanceStatusUpdatedEvent(
            GrievanceStatusUpdatedEvent event) {

        kafkaTemplate.send(
                STATUS_UPDATED_TOPIC,
                event.getGrievanceId().toString(),
                event
        );
    }
}