package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Step;
import com.badgerracing.bagder_tasks.domain.entity.Task;
import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import com.badgerracing.bagder_tasks.dto.request.StepRequest;
import com.badgerracing.bagder_tasks.dto.response.StepResponse;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.StepRepository;
import com.badgerracing.bagder_tasks.repository.TaskMemberRepository;
import com.badgerracing.bagder_tasks.repository.TaskRepository;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StepService {

    private final StepRepository       stepRepository;
    private final TaskRepository       taskRepository;
    private final UserRepository       userRepository;
    private final TaskMemberRepository taskMemberRepository;

    // helpers
    private User resolveCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new BusinessException("Usuário autenticado não encontrado", HttpStatus.NOT_FOUND));
    }

    private String resolveRole(Authentication auth) {
        return auth.getAuthorities().iterator().next().getAuthority();
    }

    private boolean isCaptain(String role) { return role.equals("ROLE_CAPTAIN"); }

    private void assertAdminAreaAccess(User currentUser, Task task, String role) {
        if (!isCaptain(role) && !currentUser.getArea().getId().equals(task.getArea().getId()))
            throw new BusinessException("Acesso negado: tarefa pertence a outra área", HttpStatus.FORBIDDEN);
    }

    private StepResponse toResponse(Step step) {
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

    /**
     * Recalculates and persists task status based on current step states.
     *   - no steps done   = NOT_STARTED
     *   - some steps done = IN_PROGRESS
     *   - all steps done  = IN_REVISION
     */
    private void recalculateTaskStatus(Task task) {
        // never auto-downgrade a task that has been approved
        if (task.getStatus() == TaskStatus.DONE) return;

        List<Step> steps = stepRepository.findByTaskId(task.getId());

        // a task with no steps stays at its current status with no auto-transition
        if (steps.isEmpty()) return;

        long doneCount = steps.stream().filter(Step::isDone).count();

        TaskStatus computed;
        if (doneCount == 0) {
            computed = TaskStatus.NOT_STARTED;
        } else if (doneCount == steps.size()) {
            computed = TaskStatus.IN_REVISION;
        } else {
            computed = TaskStatus.IN_PROGRESS;
        }

        if (task.getStatus() != computed) {
            task.setStatus(computed);
            taskRepository.save(task);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public StepResponse toggleDone(UUID stepId, boolean done, Authentication auth) {
        Step step = stepRepository.findById(stepId)
            .orElseThrow(() -> new BusinessException("Passo não encontrado", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);

        if (role.equals("ROLE_MEMBER")) {
            User currentUser = resolveCurrentUser(auth);
            boolean isAssigned = taskMemberRepository
                .existsByTaskIdAndUserId(step.getTask().getId(), currentUser.getId());
            if (!isAssigned)
                throw new BusinessException("Você não está atribuído a esta tarefa", HttpStatus.FORBIDDEN);
        }

        step.setDone(done);
        Step saved = stepRepository.save(step);

        recalculateTaskStatus(saved.getTask());

        return toResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public StepResponse create(UUID taskId, StepRequest request, Authentication auth) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        assertAdminAreaAccess(resolveCurrentUser(auth), task, role);

        if (stepRepository.existsByTaskIdAndPriority(taskId, request.priority()))
            throw new BusinessException("Já existe um passo com esta prioridade nesta tarefa", HttpStatus.CONFLICT);

        Step step = Step.builder()
                .task(task)
                .name(request.name())
                .description(request.description())
                .priority(request.priority())
                .done(false)
                .build();

        Step saved = stepRepository.save(step);

        // adding a new undone step may pull status back from IN_REVISION to IN_PROGRESS
        recalculateTaskStatus(task);

        return toResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public StepResponse update(UUID stepId, StepRequest request, Authentication auth) {
        Step step = stepRepository.findById(stepId)
            .orElseThrow(() -> new BusinessException("Passo não encontrado", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        assertAdminAreaAccess(resolveCurrentUser(auth), step.getTask(), role);

        if (request.priority() != step.getPriority() &&
            stepRepository.existsByTaskIdAndPriority(step.getTask().getId(), request.priority()))
                throw new BusinessException("Já existe um passo com esta prioridade nesta tarefa", HttpStatus.CONFLICT);

        step.setName(request.name());
        step.setDescription(request.description());
        step.setPriority(request.priority());

        return toResponse(stepRepository.save(step));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void delete(UUID stepId, Authentication auth) {
        Step step = stepRepository.findById(stepId)
            .orElseThrow(() -> new BusinessException("Passo não encontrado", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);
        assertAdminAreaAccess(resolveCurrentUser(auth), step.getTask(), role);

        Task task = step.getTask();
        stepRepository.delete(step);

        // delete a done step may change the ratio
        recalculateTaskStatus(task);
    }
}