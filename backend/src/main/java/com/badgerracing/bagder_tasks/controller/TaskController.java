package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.dto.request.TaskFilterRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskMemberRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskRequest;
import com.badgerracing.bagder_tasks.dto.response.TaskFilterResponse;
import com.badgerracing.bagder_tasks.dto.response.TaskMemberResponse;
import com.badgerracing.bagder_tasks.dto.response.TaskResponse;
import com.badgerracing.bagder_tasks.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<TaskFilterResponse> getTasks(TaskFilterRequest filter) {
        return ResponseEntity.ok(taskService.getTasksWithFilters(filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/members")
    public ResponseEntity<TaskMemberResponse> assignMember(@Valid @RequestBody TaskMemberRequest request) {
        return ResponseEntity.ok(taskService.assignMember(request));
    }

    @DeleteMapping("/{taskId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable UUID taskId, @PathVariable UUID userId) {
        taskService.removeMember(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}
