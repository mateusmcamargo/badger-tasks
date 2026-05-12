package com.badgerracing.bagder_tasks.dto.response;

import java.util.List;

public record TaskFilterResponse(
    List<TaskResponse> tasks,
    int total
) {}