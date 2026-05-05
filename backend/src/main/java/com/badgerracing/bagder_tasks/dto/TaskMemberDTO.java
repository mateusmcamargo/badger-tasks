package com.badgerracing.bagder_tasks.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskMemberDTO {
    private Long id;
    private Long taskId;
    private Long userId;
}
