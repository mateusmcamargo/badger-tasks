package com.badgerracing.bagder_tasks.dto.response;

import com.badgerracing.bagder_tasks.domain.enums.AreaName;
import java.time.LocalDateTime;
import java.util.UUID;

public record AreaResponse(
        UUID id,
        AreaName name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}