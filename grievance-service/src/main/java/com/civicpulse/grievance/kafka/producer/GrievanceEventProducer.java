package com.civicpulse.grievance.kafka.producer;

import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GrievanceEventProducer {

    private static final String TOPIC = "grievance-created";

    private final KafkaTemplate<String, GrievanceCreatedEvent> kafkaTemplate;

    public void publishGrievanceCreatedEvent(GrievanceCreatedEvent event) {

        kafkaTemplate.send(
                TOPIC,
                event.getGrievanceId().toString(),
                event
        );
    }
}