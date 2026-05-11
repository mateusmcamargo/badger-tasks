package com.badgerracing.bagder_tasks.dto.response;

public record AuthResponse(
    String token,
    String email,
    String name,
    String role
) {}