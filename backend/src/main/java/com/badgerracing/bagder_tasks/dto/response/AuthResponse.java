package com.badgerracing.bagder_tasks.dto.response;

public record AuthResponse(
    String token,
    String id,
    String email,
    String ra,
    String name,
    String role,
    String areaName
) {}