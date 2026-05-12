package com.badgerracing.bagder_tasks.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserRequest(
    @NotBlank String name,
    @NotBlank String ra,
    @NotBlank String email,
    @NotBlank String password,
    @NotNull  UUID roleId,
    @NotNull  UUID areaId
) {}