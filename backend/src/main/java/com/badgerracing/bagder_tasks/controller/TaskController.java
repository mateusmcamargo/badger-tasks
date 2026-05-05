package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.dto.TaskDTO;
import com.badgerracing.bagder_tasks.dto.TaskFilterDTO;
import com.badgerracing.bagder_tasks.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getTasks(TaskFilterDTO filter, Pageable pageable) {
        Page<TaskDTO> tasks = taskService.getTasksWithFilters(filter, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{taskId}/members/{userId}")
    public ResponseEntity<Void> assignMember(@PathVariable UUID taskId, @PathVariable UUID userId) {
        taskService.assignMemberToTask(taskId, userId);
        return ResponseEntity.ok().build();
    }
}
