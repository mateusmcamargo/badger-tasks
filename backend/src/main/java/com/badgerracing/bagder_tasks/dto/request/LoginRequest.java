package com.badgerracing.bagder_tasks.dto.request;

import jakarta.validation.constraints.NotBlank;

    // login accepts email or ra (RNF-04)
    public record LoginRequest(
            @NotBlank String login,
            @NotBlank String password
) {}