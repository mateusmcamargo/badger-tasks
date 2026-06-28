package com.badgerracing.bagder_tasks.dto.response;

import java.util.UUID;

public record AssignableUserResponse(
        UUID   id,
        String name,
        int    assignedTaskCount
) {}