package com.civicpulse.citizen.producer;

import com.civicpulse.citizen.event.CitizenCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenEventProducer {

    private static String TOPIC = "citizen-events";

    private final KafkaTemplate<String, CitizenCreatedEvent> kafkaTemplate;

    public void publishCitizenCreatedEvent(CitizenCreatedEvent event) {

        kafkaTemplate.send(TOPIC, event.getCitizenId(), event);

        log.info("CitizenCreatedEvent published for citizenId={}", event.getCitizenId());
    }
}