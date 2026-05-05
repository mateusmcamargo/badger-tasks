package com.badgerracing.bagder_tasks.dto;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private Long areaId;
    private Long leaderId;
    private Long managerId;
    private TaskStatus status;
    private boolean active;
    private LocalDateTime dateLimit;
}
