package com.badgerracing.bagder_tasks.dto.response;

import java.util.UUID;

public record TaskMemberResponse(
    UUID id,
    UUID taskId,
    UserResponse user
) {}