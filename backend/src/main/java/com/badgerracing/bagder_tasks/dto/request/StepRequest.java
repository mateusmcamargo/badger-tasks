package com.badgerracing.bagder_tasks.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StepRequest(
        @NotBlank String name,
        String description,
        @NotNull Integer priority,
        boolean done
) {}