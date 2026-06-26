package com.badgerracing.bagder_tasks.dto.request;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

public record TaskRequest(
    @NotBlank String name,
    String description,
    @NotNull UUID categoryId,
    @NotNull UUID areaId,
    @NotNull UUID leaderId,
    @NotNull UUID managerId,
    @NotNull TaskStatus status,
    @NotNull Boolean active,
    LocalDateTime dateLimit,
    List<StepRequest> steps,
    List<UUID> memberIds
) {}