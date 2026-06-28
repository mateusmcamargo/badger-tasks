package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.*;
import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
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
    private final StepRepository       stepRepository;

    // helpers
    private User resolveCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new BusinessException("Usuário autenticado não encontrado", HttpStatus.NOT_FOUND));
    }

    private String resolveRole(Authentication auth) {
        return auth.getAuthorities().iterator().next().getAuthority();
    }

    private boolean isCaptain(String role) { return role.equals("ROLE_CAPTAIN"); }
    private boolean isLeader(String role)  { return role.equals("ROLE_LEADER");  }
    private boolean isManager(String role) { return role.equals("ROLE_MANAGER"); }
    private boolean isMember(String role)  { return role.equals("ROLE_MEMBER");  }

    private void assertSameArea(User currentUser, Task task) {
        if (!currentUser.getArea().getId().equals(task.getArea().getId()))
            throw new BusinessException("Acesso negado: tarefa pertence a outra área", HttpStatus.FORBIDDEN);
    }

    private void assertMemberAssigned(User currentUser, Task task) {
        boolean isAssigned = taskMemberRepository
            .existsByTaskIdAndUserId(task.getId(), currentUser.getId());
        if (!isAssigned)
            throw new BusinessException("Você não está atribuído a esta tarefa", HttpStatus.FORBIDDEN);
    }

    // read ops
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskFilterResponse getTasksWithFilters(TaskFilterRequest filter, Authentication auth) {
        String role = resolveRole(auth);

        if (!isCaptain(role)) {
            User currentUser = resolveCurrentUser(auth);
            filter = new TaskFilterRequest(
                currentUser.getArea().getId(),
                filter.categoryId(),
                filter.status(),
                filter.active(),
                filter.memberId()
            );
        }

        Specification<Task> spec = TaskSpecification.getFilterSpecification(filter);
        List<TaskResponse> tasks = taskRepository.findAll(spec)
            .stream().map(this::toResponse).toList();
        return new TaskFilterResponse(tasks, tasks.size());
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskResponse getById(UUID id, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        if (!isCaptain(role)) {
            assertSameArea(resolveCurrentUser(auth), task);
        }

        return toResponse(task);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse create(TaskRequest request, Authentication authentication) {
        String role = resolveRole(authentication);
        if (!isCaptain(role)) {
            User currentUser = resolveCurrentUser(authentication);
            if (!currentUser.getArea().getId().equals(request.areaId()))
                throw new BusinessException("Você só pode criar tarefas na sua própria área", HttpStatus.FORBIDDEN);
        }

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

        taskRepository.save(task);

        if (request.steps() != null) {
            request.steps().forEach(s -> stepRepository.save(
                Step.builder()
                    .task(task)
                    .name(s.name())
                    .description(s.description())
                    .priority(s.priority())
                    .done(s.done())
                    .build()
            ));
        }

        if (request.memberIds() != null) {
            request.memberIds().forEach(userId -> {
                User member = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));
                taskMemberRepository.save(
                    TaskMember.builder().task(task).user(member).build()
                );
            });
        }

        return toResponse(taskRepository.save(task));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse update(UUID id, TaskRequest request, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        if (!isCaptain(role)) {
            assertSameArea(resolveCurrentUser(auth), task);
        }

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
    public void delete(UUID id, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        if (!isCaptain(role)) {
            assertSameArea(resolveCurrentUser(auth), task);
        }

        taskRepository.deleteById(id);
    }

    /**
     * PATCH /api/tasks/{id}/start
     * member-initiated, moves NOT_STARTED to IN_PROGRESS.
     * caller member must be assigned to the task.
     */
    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskResponse start(UUID id, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);

        if (isMember(role)) {
            assertMemberAssigned(resolveCurrentUser(auth), task);
        } else {
            if (!isCaptain(role)) assertSameArea(resolveCurrentUser(auth), task);
        }

        if (task.getStatus() != TaskStatus.NOT_STARTED)
            throw new BusinessException("Apenas tarefas não iniciadas podem ser iniciadas", HttpStatus.CONFLICT);

        task.setStatus(TaskStatus.IN_PROGRESS);
        return toResponse(taskRepository.save(task));
    }

    /**
     * PATCH /api/tasks/{id}/submit
     * member-initiated, checks all steps and moves to IN_REVISION.
     * caller must be assigned to the task.
     */
    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskResponse submit(UUID id, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);

        if (isMember(role)) {
            assertMemberAssigned(resolveCurrentUser(auth), task);
        } else {
            if (!isCaptain(role)) assertSameArea(resolveCurrentUser(auth), task);
        }

        if (task.getStatus() == TaskStatus.DONE)
            throw new BusinessException("Tarefa já foi concluída", HttpStatus.CONFLICT);

        if (task.getStatus() == TaskStatus.IN_REVISION)
            throw new BusinessException("Tarefa já está em revisão", HttpStatus.CONFLICT);

        // mark every step as done
        List<Step> steps = stepRepository.findByTaskId(id);
        steps.forEach(s -> s.setDone(true));
        stepRepository.saveAll(steps);

        task.setStatus(TaskStatus.IN_REVISION);
        return toResponse(taskRepository.save(task));
    }

    /**
     * PATCH /api/tasks/{id}/approve
     * admin-only, moves IN_REVISION to DONE and deactivates the task.
     */
    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public TaskResponse approve(UUID id, Authentication auth) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        if (!isCaptain(role)) {
            assertSameArea(resolveCurrentUser(auth), task);
        }

        if (task.getStatus() != TaskStatus.IN_REVISION)
            throw new BusinessException("Apenas tarefas em revisão podem ser aprovadas", HttpStatus.CONFLICT);

        task.setStatus(TaskStatus.DONE);
        task.setActive(false);
        return toResponse(taskRepository.save(task));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public TaskMemberResponse assignMember(TaskMemberRequest request, Authentication auth) {
        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        String role        = resolveRole(auth);
        User   currentUser = resolveCurrentUser(auth);

        if (isMember(role)) {
            if (!currentUser.getId().equals(user.getId()))
                throw new BusinessException("Membros só podem se auto-atribuir", HttpStatus.FORBIDDEN);
            if (!currentUser.getArea().getId().equals(task.getArea().getId()))
                throw new BusinessException("Você não pertence à área desta tarefa", HttpStatus.FORBIDDEN);
        } else if (isLeader(role) || isManager(role)) {
            if (!user.getArea().getId().equals(currentUser.getArea().getId()))
                throw new BusinessException("Usuário não pertence à sua área", HttpStatus.FORBIDDEN);
            if (currentUser.getId().equals(user.getId()))
                throw new BusinessException("Líderes e gestores são vinculados à tarefa diretamente", HttpStatus.FORBIDDEN);
        }

        if (taskMemberRepository.existsByTaskIdAndUserId(request.taskId(), request.userId()))
            throw new BusinessException("Usuário já está associado a esta tarefa", HttpStatus.CONFLICT);

        TaskMember member = taskMemberRepository.save(
                TaskMember.builder().task(task).user(user).build()
        );
        return new TaskMemberResponse(member.getId(), task.getId(), toUserResponse(user));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public void removeMember(UUID taskId, UUID userId, Authentication auth) {
        TaskMember member = taskMemberRepository.findByTaskIdAndUserId(taskId, userId)
            .orElseThrow(() -> new BusinessException("Membro não encontrado na tarefa", HttpStatus.NOT_FOUND));

        String role        = resolveRole(auth);
        User   currentUser = resolveCurrentUser(auth);

        if (isMember(role)) {
            if (!currentUser.getId().equals(userId))
                throw new BusinessException("Membros só podem se remover da própria tarefa", HttpStatus.FORBIDDEN);
        } else if (isLeader(role) || isManager(role)) {
            if (!member.getUser().getArea().getId().equals(currentUser.getArea().getId()))
                throw new BusinessException("Usuário não pertence à sua área", HttpStatus.FORBIDDEN);
        }

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