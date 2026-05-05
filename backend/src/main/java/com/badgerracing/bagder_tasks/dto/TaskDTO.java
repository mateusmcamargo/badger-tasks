package com.badgerracing.bagder_tasks.dto;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID categoryId;
    private UUID areaId;
    private UUID leaderId;
    private UUID managerId;
    private TaskStatus status;
    private boolean active;
    private LocalDateTime dateLimit;
}
