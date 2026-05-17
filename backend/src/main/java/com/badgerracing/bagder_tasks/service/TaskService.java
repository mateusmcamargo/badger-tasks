package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.*;
import com.badgerracing.bagder_tasks.dto.request.TaskFilterRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskMemberRequest;
import com.badgerracing.bagder_tasks.dto.request.TaskRequest;
import com.badgerracing.bagder_tasks.dto.response.*;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.*;
import com.badgerracing.bagder_tasks.specification.TaskSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));
        return toResponse(task);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse create(TaskRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new BusinessException("Categoria não encontrada", HttpStatus.NOT_FOUND));
        Area area = areaRepository.findById(request.areaId())
            .orElseThrow(() -> new BusinessException("Área não encontrada", HttpStatus.NOT_FOUND));
        User leader = userRepository.findById(request.leaderId())
            .orElseThrow(() -> new BusinessException("Líder não encontrado", HttpStatus.NOT_FOUND));
        User manager = userRepository.findById(request.managerId())
            .orElseThrow(() -> new BusinessException("Gestor não encontrado", HttpStatus.NOT_FOUND));

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
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        task.setName(request.name());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setActive(request.active());
        task.setDateLimit(request.dateLimit());
        task.setCategory(categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new BusinessException("Categoria não encontrada", HttpStatus.NOT_FOUND)));
        task.setArea(areaRepository.findById(request.areaId())
            .orElseThrow(() -> new BusinessException("Área não encontrada", HttpStatus.NOT_FOUND)));
        task.setLeader(userRepository.findById(request.leaderId())
            .orElseThrow(() -> new BusinessException("Líder não encontrado", HttpStatus.NOT_FOUND)));
        task.setManager(userRepository.findById(request.managerId())
            .orElseThrow(() -> new BusinessException("Gestor não encontrado", HttpStatus.NOT_FOUND)));

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void delete(UUID id) {
        if (!taskRepository.existsById(id))
            throw new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND);
        taskRepository.deleteById(id);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskMemberResponse assignMember(TaskMemberRequest request, Authentication auth) {
        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        String roleName = auth.getAuthorities().iterator().next().getAuthority(); // "ROLE_MEMBER" etc.
        String currentUserEmail = auth.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new BusinessException("Usuário autenticado não encontrado", HttpStatus.NOT_FOUND));

        assert roleName != null;
        boolean isMember  = roleName.equals("ROLE_MEMBER");
        boolean isLeader  = roleName.equals("ROLE_LEADER");
        boolean isManager = roleName.equals("ROLE_MANAGER");

        if (isMember) {
            // for members: can only self assign and must be in their area
            if (!currentUser.getId().equals(user.getId()))
                throw new BusinessException("Membros só podem se auto-atribuir", HttpStatus.FORBIDDEN);
            if (!currentUser.getArea().getId().equals(task.getArea().getId()))
                throw new BusinessException("Você não pertence à área desta tarefa", HttpStatus.FORBIDDEN);
        } else if (isLeader || isManager) {
            // for leaders and managers: can assign members, but only from their own area
            // cannot assign themselves
            if (!user.getArea().getId().equals(currentUser.getArea().getId()))
                throw new BusinessException("Usuário não pertence à sua área", HttpStatus.FORBIDDEN);
            if (currentUser.getId().equals(user.getId()))
                throw new BusinessException("Líderes e gestores são vinculados à tarefa diretamente", HttpStatus.FORBIDDEN);
        }
        // for captain: no restrictions
        if (taskMemberRepository.existsByTaskIdAndUserId(request.taskId(), request.userId()))
            throw new BusinessException("Usuário já está associado a esta tarefa", HttpStatus.CONFLICT);

        TaskMember member = taskMemberRepository.save(
                TaskMember.builder().task(task).user(user).build()
        );
        return new TaskMemberResponse(member.getId(), task.getId(), toUserResponse(user));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void removeMember(UUID taskId, UUID userId) {
        TaskMember member = taskMemberRepository.findByTaskIdAndUserId(taskId, userId)
            .orElseThrow(() ->  new BusinessException("Membro não encontrado na tarefa", HttpStatus.NOT_FOUND));
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