package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.Step;
import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.dto.response.StepResponse;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.StepRepository;
import com.badgerracing.bagder_tasks.repository.TaskMemberRepository;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StepService {

    private final StepRepository       stepRepository;
    private final UserRepository       userRepository;
    private final TaskMemberRepository taskMemberRepository;

    private User resolveCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new BusinessException("Usuário autenticado não encontrado", HttpStatus.NOT_FOUND));
    }

    private String resolveRole(Authentication auth) {
        return auth.getAuthorities().iterator().next().getAuthority();
    }

    @Transactional
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER', 'MEMBER')")
    public StepResponse toggleDone(UUID stepId, boolean done, Authentication auth) {
        Step step = stepRepository.findById(stepId)
            .orElseThrow(() -> new BusinessException("Passo não encontrado", HttpStatus.NOT_FOUND));

        String role = resolveRole(auth);

        // members can only toggle steps on tasks they are assigned to
        if (role.equals("ROLE_MEMBER")) {
            User currentUser = resolveCurrentUser(auth);
            boolean isAssigned = taskMemberRepository
                .existsByTaskIdAndUserId(step.getTask().getId(), currentUser.getId());
            if (!isAssigned)
                throw new BusinessException("Você não está atribuído a esta tarefa", HttpStatus.FORBIDDEN);
        }

        step.setDone(done);
        Step saved = stepRepository.save(step);

        return new StepResponse(
            saved.getId(),
            saved.getName(),
            saved.getDescription(),
            saved.isDone(),
            saved.getPriority(),
            saved.getCreatedAt(),
            saved.getUpdatedAt()
        );
    }
}