package com.badgerracing.bagder_tasks.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
    @NotBlank String name,
    String description
) {}