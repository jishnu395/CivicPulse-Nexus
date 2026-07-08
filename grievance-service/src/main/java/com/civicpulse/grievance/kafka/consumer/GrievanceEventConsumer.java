package com.civicpulse.grievance.kafka.consumer;

import com.civicpulse.grievance.kafka.event.GrievanceCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class GrievanceEventConsumer {

    @KafkaListener(
            topics = "grievance-created",
            groupId = "grievance-service"
    )
    public void consume(GrievanceCreatedEvent event) {

        System.out.println("==================================");
        System.out.println("Grievance Event Received");
        System.out.println(event);
        System.out.println("==================================");
    }
}