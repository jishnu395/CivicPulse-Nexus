package com.civicpulse.grievance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class GrievanceServiceApplication {

    public static void main(String[] args) {

        System.out.println("############################");
        System.out.println("I AM RUNNING GRIEVANCE SERVICE");
        System.out.println("############################");

        SpringApplication.run(GrievanceServiceApplication.class, args);
    }
}
