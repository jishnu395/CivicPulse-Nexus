package com.civicpulse.servicemanagement.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class ApplicationNumberGenerator {

    private ApplicationNumberGenerator() {
    }

    public static String generate() {

        String date = LocalDate.now()
                .format(DateTimeFormatter.BASIC_ISO_DATE);

        String random = UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();

        return "APP-" + date + "-" + random;
    }
}