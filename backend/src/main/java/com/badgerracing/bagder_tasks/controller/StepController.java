package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.dto.response.StepResponse;
import com.badgerracing.bagder_tasks.service.StepService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/steps")
@RequiredArgsConstructor
public class StepController {

    private final StepService stepService;

    @PatchMapping("/{id}/done")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StepResponse> toggleDone(
        @PathVariable UUID id,
        @RequestParam boolean done,
        Authentication authentication
    ) {
        return ResponseEntity.ok(stepService.toggleDone(id, done, authentication));
    }
}