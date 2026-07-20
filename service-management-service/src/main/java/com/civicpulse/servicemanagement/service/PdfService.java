package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.entity.Application;

public interface PdfService {

    String generateCertificate(Application application);

}