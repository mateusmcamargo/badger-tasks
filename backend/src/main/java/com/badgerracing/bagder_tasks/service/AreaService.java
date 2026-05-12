package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Area;
import com.badgerracing.bagder_tasks.dto.response.AreaResponse;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    @Transactional(readOnly = true)
    public List<AreaResponse> getAll() {
        return areaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AreaResponse getById(UUID id) {
        return areaRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new BusinessException("Área não encontrada", HttpStatus.NOT_FOUND));
    }

    private AreaResponse toResponse(Area area) {
        return new AreaResponse(
            area.getId(),
            area.getName(),
            area.getDescription(),
            area.getCreatedAt(),
            area.getUpdatedAt()
        );
    }
}