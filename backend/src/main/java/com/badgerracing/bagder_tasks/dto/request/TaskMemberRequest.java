package com.badgerracing.bagder_tasks.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record TaskMemberRequest(
    @NotNull UUID taskId,
    @NotNull UUID userId
) {}