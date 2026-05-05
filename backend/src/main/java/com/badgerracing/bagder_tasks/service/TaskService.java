package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Task;
import com.badgerracing.bagder_tasks.domain.entity.TaskMember;
import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.dto.TaskDTO;
import com.badgerracing.bagder_tasks.dto.TaskFilterDTO;
import com.badgerracing.bagder_tasks.repository.TaskMemberRepository;
import com.badgerracing.bagder_tasks.repository.TaskRepository;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import com.badgerracing.bagder_tasks.specification.TaskSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMemberRepository taskMemberRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    // Spring Security annotation that will be active when Auth is complete
    // @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public Page<TaskDTO> getTasksWithFilters(TaskFilterDTO filter, Pageable pageable) {
        Specification<Task> spec = TaskSpecification.getFilterSpecification(filter);
        return taskRepository.findAll(spec, pageable).map(this::toDTO);
    }

    @Transactional
    // @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public void assignMemberToTask(UUID taskId, UUID userId) {
        // Here we'd typically also verify if the Leader is assigning to their own Area (RF-09).
        // For now, focusing on the Member-Task association logic (RF-04)

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (taskMemberRepository.existsByTaskIdAndUserId(taskId, userId)) {
            throw new IllegalArgumentException("Usuário já está associado a esta tarefa");
        }

        TaskMember taskMember = TaskMember.builder()
                .task(task)
                .user(user)
                .build();

        taskMemberRepository.save(taskMember);
    }

    private TaskDTO toDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
                .areaId(task.getArea() != null ? task.getArea().getId() : null)
                .leaderId(task.getLeader() != null ? task.getLeader().getId() : null)
                .managerId(task.getManager() != null ? task.getManager().getId() : null)
                .status(task.getStatus())
                .active(task.isActive())
                .dateLimit(task.getDateLimit())
                .build();
    }
}
