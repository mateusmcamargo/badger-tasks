package com.badgerracing.bagder_tasks.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String name,
    String ra,
    String email,
    RoleResponse role,
    AreaResponse area,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}