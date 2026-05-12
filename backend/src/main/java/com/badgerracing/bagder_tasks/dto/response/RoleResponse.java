package com.badgerracing.bagder_tasks.dto.response;

import com.badgerracing.bagder_tasks.domain.enums.RoleName;
import java.time.LocalDateTime;
import java.util.UUID;

public record RoleResponse(
    UUID id,
    RoleName name,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}