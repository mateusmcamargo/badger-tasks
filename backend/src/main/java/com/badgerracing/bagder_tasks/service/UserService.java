package com.badgerracing.bagder_tasks.service;

import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.dto.request.UserRequest;
import com.badgerracing.bagder_tasks.dto.response.*;
import com.badgerracing.bagder_tasks.repository.AreaRepository;
import com.badgerracing.bagder_tasks.repository.RoleRepository;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository  userRepository;
    private final RoleRepository  roleRepository;
    private final AreaRepository  areaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        return userRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        User user = User.builder()
                .name(request.name())
                .ra(request.ra())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(roleRepository.findById(request.roleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role não encontrada")))
                .area(areaRepository.findById(request.areaId())
                    .orElseThrow(() -> new IllegalArgumentException("Área não encontrada")))
                .build();
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        user.setName(request.name());
        user.setRa(request.ra());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(roleRepository.findById(request.roleId())
            .orElseThrow(() -> new IllegalArgumentException("Role não encontrada")));
        user.setArea(areaRepository.findById(request.areaId())
            .orElseThrow(() -> new IllegalArgumentException("Área não encontrada")));
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {
        if (!userRepository.existsById(id))
            throw new IllegalArgumentException("Usuário não encontrado");
        userRepository.deleteById(id);
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