package com.badgerracing.bagder_tasks.dto.request;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import java.util.UUID;

public record TaskFilterRequest(
    UUID areaId,
    UUID categoryId,
    TaskStatus status,
    Boolean active,
    UUID memberId
) {}