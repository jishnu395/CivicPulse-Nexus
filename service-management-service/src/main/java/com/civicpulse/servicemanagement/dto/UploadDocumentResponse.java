package com.civicpulse.servicemanagement.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadDocumentResponse {

    private Long id;
    private String documentName;
    private String fileUrl;
}