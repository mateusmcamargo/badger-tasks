package com.badgerracing.bagder_tasks.dto.response;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TaskResponse(
    UUID id,
    String name,
    String description,
    CategoryResponse category,
    AreaResponse area,
    UserResponse leader,
    UserResponse manager,
    TaskStatus status,
    boolean active,
    LocalDateTime dateLimit,
    List<StepResponse> steps,
    List<UserResponse> assignedTo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}