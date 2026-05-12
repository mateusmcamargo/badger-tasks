package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.dto.response.AreaResponse;
import com.badgerracing.bagder_tasks.service.AreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public ResponseEntity<List<AreaResponse>> getAll() {
        return ResponseEntity.ok(areaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(areaService.getById(id));
    }
}