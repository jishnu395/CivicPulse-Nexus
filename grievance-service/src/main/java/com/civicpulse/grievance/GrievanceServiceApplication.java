package com.civicpulse.grievance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GrievanceServiceApplication {

    public static void main(String[] args) {

        System.out.println("############################");
        System.out.println("I AM RUNNING GRIEVANCE SERVICE");
        System.out.println("############################");

        SpringApplication.run(GrievanceServiceApplication.class, args);
    }
}
