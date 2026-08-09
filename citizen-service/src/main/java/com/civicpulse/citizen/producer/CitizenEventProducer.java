package com.civicpulse.citizen.producer;

import com.civicpulse.citizen.event.CitizenCreatedEvent;
import com.civicpulse.citizen.event.CitizenDeletedEvent;
import com.civicpulse.citizen.event.CitizenUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenEventProducer {

    private static final String TOPIC_CREATED = "citizen-events";
    private static final String TOPIC_UPDATED = "citizen-updated";
    private static final String TOPIC_DELETED = "citizen-deleted";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishCitizenCreatedEvent(CitizenCreatedEvent event) {
        kafkaTemplate.send(TOPIC_CREATED, event.getCitizenId(), event);
        log.info("CitizenCreatedEvent published for citizenId={}", event.getCitizenId());
    }

    public void publishCitizenUpdatedEvent(CitizenUpdatedEvent event) {
        kafkaTemplate.send(TOPIC_UPDATED, event.getCitizenId(), event);
        log.info("CitizenUpdatedEvent published for citizenId={}", event.getCitizenId());
    }

    public void publishCitizenDeletedEvent(CitizenDeletedEvent event) {
        kafkaTemplate.send(TOPIC_DELETED, event.getCitizenId(), event);
        log.info("CitizenDeletedEvent published for citizenId={}", event.getCitizenId());
    }
}