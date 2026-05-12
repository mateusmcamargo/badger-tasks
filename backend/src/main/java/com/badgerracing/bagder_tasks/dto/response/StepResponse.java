package com.badgerracing.bagder_tasks.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record StepResponse(
    UUID id,
    String name,
    String description,
    boolean done,
    int priority,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}