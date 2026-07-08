package com.civicpulse.grievance.service.impl;

import com.civicpulse.grievance.dto.GrievanceHistoryResponse;
import com.civicpulse.grievance.entity.GrievanceHistory;
import com.civicpulse.grievance.enums.GrievanceStatus;
import com.civicpulse.grievance.mapper.GrievanceHistoryMapper;
import com.civicpulse.grievance.repository.GrievanceHistoryRepository;
import com.civicpulse.grievance.service.interfaces.GrievanceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrievanceHistoryServiceImpl implements GrievanceHistoryService {

    private final GrievanceHistoryRepository historyRepository;
    private final GrievanceHistoryMapper historyMapper;

    @Override
    public void saveHistory(Long grievanceId,
                            GrievanceStatus status,
                            String remarks) {

        GrievanceHistory history = GrievanceHistory.builder()
                .grievanceId(grievanceId)
                .status(status)
                .remarks(remarks)
                .updatedAt(LocalDateTime.now())
                .build();

        historyRepository.save(history);
    }

    @Override
    public List<GrievanceHistoryResponse> getHistoryByGrievanceId(Long grievanceId) {

        return historyRepository
                .findByGrievanceIdOrderByUpdatedAtAsc(grievanceId)
                .stream()
                .map(historyMapper::toResponse)
                .toList();
    }
}