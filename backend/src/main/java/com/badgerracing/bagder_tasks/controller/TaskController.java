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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<TaskFilterResponse> getTasks(TaskFilterRequest filter, Authentication authentication) {
        return ResponseEntity.ok(taskService.getTasksWithFilters(filter, authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(taskService.getById(id, authentication));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return ResponseEntity.ok(taskService.create(request, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
        @PathVariable UUID id,
        @Valid @RequestBody TaskRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.update(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id, Authentication authentication) {
        taskService.delete(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<TaskResponse> startTask(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(taskService.start(id, authentication));
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<TaskResponse> submitTask(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(taskService.submit(id, authentication));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<TaskResponse> approveTask(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.ok(taskService.approve(id, authentication));
    }

    @PostMapping("/members")
    public ResponseEntity<TaskMemberResponse> assignMember(
        @Valid @RequestBody
        TaskMemberRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.assignMember(request, authentication));
    }

    @DeleteMapping("/{taskId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
        @PathVariable UUID taskId,
        @PathVariable UUID userId,
        Authentication authentication
    ) {
        taskService.removeMember(taskId, userId, authentication);
        return ResponseEntity.noContent().build();
    }
}