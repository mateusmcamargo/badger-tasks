package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.dto.request.UserRequest;
import com.badgerracing.bagder_tasks.dto.response.AssignableUserResponse;
import com.badgerracing.bagder_tasks.dto.response.UserResponse;
import com.badgerracing.bagder_tasks.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserResponse>> getAll(
            @RequestParam(required = false) UUID areaId
    ) {
        return ResponseEntity.ok(userService.getAll(areaId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/assignable")
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public ResponseEntity<List<AssignableUserResponse>> getAssignableMembers(
        @RequestParam UUID    taskId,
        @RequestParam(required = false, defaultValue = "") String name,
        Authentication authentication
    ) {
        return ResponseEntity.ok(userService.getAssignableMembers(taskId, name, authentication));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CAPTAIN')")
    public ResponseEntity<UserResponse> update(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CAPTAIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}