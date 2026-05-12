package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Role;
import com.badgerracing.bagder_tasks.dto.response.RoleResponse;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RoleResponse getById(UUID id) {
        return roleRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new BusinessException("Cargo não encontrado", HttpStatus.NOT_FOUND));
    }

    private RoleResponse toResponse(Role role) {
        return new RoleResponse(
            role.getId(),
            role.getName(),
            role.getDescription(),
            role.getCreatedAt(),
            role.getUpdatedAt()
        );
    }
}