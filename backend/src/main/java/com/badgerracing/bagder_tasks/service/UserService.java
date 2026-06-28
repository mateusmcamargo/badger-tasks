package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.domain.enums.RoleName;
import com.badgerracing.bagder_tasks.dto.request.UserRequest;
import com.badgerracing.bagder_tasks.dto.response.*;
import com.badgerracing.bagder_tasks.exception.BusinessException;
import com.badgerracing.bagder_tasks.repository.AreaRepository;
import com.badgerracing.bagder_tasks.repository.RoleRepository;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.badgerracing.bagder_tasks.dto.response.AssignableUserResponse;
import com.badgerracing.bagder_tasks.repository.TaskMemberRepository;
import com.badgerracing.bagder_tasks.repository.TaskRepository;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository        userRepository;
    private final RoleRepository        roleRepository;
    private final AreaRepository        areaRepository;
    private final PasswordEncoder       passwordEncoder;
    private final TaskMemberRepository  taskMemberRepository;
    private final TaskRepository        taskRepository;

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public List<UserResponse> getAll(UUID areaId) {
        List<User> users = areaId != null
                ? userRepository.findByAreaId(areaId)
                : userRepository.findAll();
        return users.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public UserResponse getById(UUID id) {
        return userRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public UserResponse create(UserRequest request) {

        // RF-14: unique email and RA
        if (userRepository.existsByEmail(request.email()))
            throw new BusinessException("Email já cadastrado", HttpStatus.CONFLICT);
        if (userRepository.existsByRa(request.ra()))
            throw new BusinessException("RA já cadastrado", HttpStatus.CONFLICT);

        var role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new BusinessException("Cargo não encontrado", HttpStatus.NOT_FOUND));

        var area = areaRepository.findById(request.areaId())
                .orElseThrow(() -> new BusinessException("Área não encontrada", HttpStatus.NOT_FOUND));

        // RF-12: only one Captain allowed
        if (role.getName() == RoleName.CAPTAIN && userRepository.existsByRoleName(RoleName.CAPTAIN))
            throw new BusinessException("Já existe um Capitão cadastrado", HttpStatus.CONFLICT);

        // RF-13: only one Leader per area
        if (role.getName() == RoleName.LEADER && userRepository.existsByRoleNameAndAreaId(RoleName.LEADER, area.getId()))
            throw new BusinessException("Já existe um Líder nessa área", HttpStatus.CONFLICT);

        User user = User.builder()
                .name(request.name())
                .ra(request.ra())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .area(area)
                .build();
        return toResponse(userRepository.save(user));
    }

    @Transactional
    @PreAuthorize("hasRole('CAPTAIN')")
    public UserResponse update(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        // RF-14: unique email and RA, excluding current user
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email()))
            throw new BusinessException("Email já cadastrado", HttpStatus.CONFLICT);
        if (!user.getRa().equals(request.ra()) && userRepository.existsByRa(request.ra()))
            throw new BusinessException("RA já cadastrado", HttpStatus.CONFLICT);

        var role = roleRepository.findById(request.roleId())
            .orElseThrow(() -> new BusinessException("Cargo não encontrado", HttpStatus.NOT_FOUND));

        var area = areaRepository.findById(request.areaId())
            .orElseThrow(() -> new BusinessException("Área não encontrada", HttpStatus.NOT_FOUND));

        // RF-12: only one Captain — block if assigning Captain to a different user
        if (role.getName() == RoleName.CAPTAIN
            && user.getRole().getName() != RoleName.CAPTAIN
            && userRepository.existsByRoleName(RoleName.CAPTAIN))
            throw new BusinessException("Já existe um Capitão cadastrado", HttpStatus.CONFLICT);

        // RF-13: only one Leader per area — block if assigning Leader to an area that already has one
        if (role.getName() == RoleName.LEADER
            && (user.getRole().getName() != RoleName.LEADER || !user.getArea().getId().equals(area.getId()))
            && userRepository.existsByRoleNameAndAreaId(RoleName.LEADER, area.getId()))
            throw new BusinessException("Já existe um Líder nessa área", HttpStatus.CONFLICT);

        user.setName(request.name());
        user.setRa(request.ra());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setArea(area);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    @PreAuthorize("hasRole('CAPTAIN')")
    public void delete(UUID id) {
        if (!userRepository.existsById(id))
            throw new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND);
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('CAPTAIN', 'MANAGER', 'LEADER')")
    public List<AssignableUserResponse> getAssignableMembers(UUID taskId, String name, Authentication authentication) {

        var task = taskRepository.findById(taskId)
            .orElseThrow(() -> new BusinessException("Tarefa não encontrada", HttpStatus.NOT_FOUND));

        UUID requestingUserId = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new BusinessException("Usuário não encontrado", HttpStatus.NOT_FOUND))
            .getId();

        // captain gets the task's area; manager/leader must belong to the same area
        var currentUser = userRepository.findByEmail(authentication.getName()).get();
        boolean isCaptain = currentUser.getRole().getName() == RoleName.CAPTAIN;
        if (!isCaptain && !currentUser.getArea().getId().equals(task.getArea().getId()))
            throw new BusinessException("Sem permissão para esta área", HttpStatus.FORBIDDEN);

        return userRepository
            .findAssignableMembersForTask(task.getArea().getId(), taskId, name, requestingUserId)
            .stream()
            .map(u -> new AssignableUserResponse(
                u.getId(),
                u.getName(),
                taskMemberRepository.countByUserId(u.getId())
            ))
            .toList();
    }


    private UserResponse toResponse(User user) {
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
            new AreaResponse(
                user.getArea().getId(),
                user.getArea().getName(),
                user.getArea().getDescription(),
                user.getArea().getCreatedAt(),
                user.getArea().getUpdatedAt()
            ),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}