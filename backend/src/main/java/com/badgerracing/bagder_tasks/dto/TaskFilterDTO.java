package com.badgerracing.bagder_tasks.dto;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilterDTO {
    private Long areaId;
    private Long categoryId;
    private TaskStatus status;
    private Boolean active;
    private Long memberId;
}
