package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Category;
import com.badgerracing.bagder_tasks.dto.request.CategoryRequest;
import com.badgerracing.bagder_tasks.dto.response.CategoryResponse;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID id) {
        return categoryRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new BusinessException("Categoria não encontrada", HttpStatus.NOT_FOUND));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER')")
    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
            .name(request.name())
            .description(request.description())
            .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER')")
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Categoria não encontrada", HttpStatus.NOT_FOUND));
        category.setName(request.name());
        category.setDescription(request.description());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER')")
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id))
            throw new BusinessException("Categoria não encontrada", HttpStatus.NOT_FOUND);
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }
}