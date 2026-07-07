package com.civicpulse.citizen.exception;

public class CitizenNotFoundException extends RuntimeException {

    public CitizenNotFoundException(String message) {
        super(message);
    }
}