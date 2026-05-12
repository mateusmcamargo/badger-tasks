package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.*;
import com.badgerracing.bagder_tasks.dto.request.TaskFilterRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskMemberRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskRequest;
import com.badgerracing.bagder_tasks.dto.response.*;
import com.badgerracing.bagder_tasks.repository.*;
import com.badgerracing.bagder_tasks.specification.TaskSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository       taskRepository;
    private final TaskMemberRepository taskMemberRepository;
    private final UserRepository       userRepository;
    private final CategoryRepository   categoryRepository;
    private final AreaRepository       areaRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskFilterResponse getTasksWithFilters(TaskFilterRequest filter) {
        Specification<Task> spec = TaskSpecification.getFilterSpecification(filter);
        List<TaskResponse> tasks = taskRepository.findAll(spec)
            .stream().map(this::toResponse).toList();
        return new TaskFilterResponse(tasks, tasks.size());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskResponse getById(UUID id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));
        return toResponse(task);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse create(TaskRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        Area area = areaRepository.findById(request.areaId())
            .orElseThrow(() -> new IllegalArgumentException("Área não encontrada"));
        User leader = userRepository.findById(request.leaderId())
            .orElseThrow(() -> new IllegalArgumentException("Líder não encontrado"));
        User manager = userRepository.findById(request.managerId())
            .orElseThrow(() -> new IllegalArgumentException("Gestor não encontrado"));

        Task task = Task.builder()
                .name(request.name())
                .description(request.description())
                .category(category)
                .area(area)
                .leader(leader)
                .manager(manager)
                .status(request.status())
                .active(request.active())
                .dateLimit(request.dateLimit())
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse update(UUID id, TaskRequest request) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));

        task.setName(request.name());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setActive(request.active());
        task.setDateLimit(request.dateLimit());
        task.setCategory(categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada")));
        task.setArea(areaRepository.findById(request.areaId())
            .orElseThrow(() -> new IllegalArgumentException("Área não encontrada")));
        task.setLeader(userRepository.findById(request.leaderId())
            .orElseThrow(() -> new IllegalArgumentException("Líder não encontrado")));
        task.setManager(userRepository.findById(request.managerId())
            .orElseThrow(() -> new IllegalArgumentException("Gestor não encontrado")));

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void delete(UUID id) {
        if (!taskRepository.existsById(id))
            throw new IllegalArgumentException("Tarefa não encontrada");
        taskRepository.deleteById(id);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskMemberResponse assignMember(TaskMemberRequest request) {
        Task task = taskRepository.findById(request.taskId())
            .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));
        User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (taskMemberRepository.existsByTaskIdAndUserId(request.taskId(), request.userId()))
        throw new IllegalArgumentException("Usuário já está associado a esta tarefa");

        TaskMember member = taskMemberRepository.save(
            TaskMember.builder().task(task).user(user).build()
        );

        return new TaskMemberResponse(member.getId(), task.getId(), toUserResponse(user));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void removeMember(UUID taskId, UUID userId) {
        TaskMember member = taskMemberRepository.findByTaskIdAndUserId(taskId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Membro não encontrado na tarefa"));
        taskMemberRepository.delete(member);
    }

    private TaskResponse toResponse(Task task) {
        List<UserResponse> assignedTo = task.getMembers() == null ? List.of() :
            task.getMembers().stream().map(m -> toUserResponse(m.getUser())).toList();

        List<StepResponse> steps = task.getSteps() == null ? List.of() :
            task.getSteps().stream().map(this::toStepResponse).toList();

        return new TaskResponse(
            task.getId(),
            task.getName(),
            task.getDescription(),
            toCategoryResponse(task.getCategory()),
            toAreaResponse(task.getArea()),
            toUserResponse(task.getLeader()),
            toUserResponse(task.getManager()),
            task.getStatus(),
            task.isActive(),
            task.getDateLimit(),
            steps,
            assignedTo,
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getRa(),
            user.getEmail(),
            new RoleResponse(
                user.getRole().getId(),
                user.getRole().getName(),
                user.getRole().getDescription(),
                user.getRole().getCreatedAt(),
                user.getRole().getUpdatedAt()
            ),
            toAreaResponse(user.getArea()),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    private AreaResponse toAreaResponse(Area area) {
        return new AreaResponse(
            area.getId(),
            area.getName(),
            area.getDescription(),
            area.getCreatedAt(),
            area.getUpdatedAt()
        );
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }

    private StepResponse toStepResponse(Step step) {
        return new StepResponse(
            step.getId(),
            step.getName(),
            step.getDescription(),
            step.isDone(),
            step.getPriority(),
            step.getCreatedAt(),
            step.getUpdatedAt()
        );
    }
}