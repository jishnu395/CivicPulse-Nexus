package com.civicpulse.servicemanagement.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "citizen-service")
public interface CitizenServiceClient {

}