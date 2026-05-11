package com.badgerracing.bagder_tasks.dto;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilterDTO {
    private UUID areaId;
    private UUID categoryId;
    private TaskStatus status;
    private Boolean active;
    private UUID memberId;
}
