package com.badgerracing.bagder_tasks.repository;

import com.badgerracing.bagder_tasks.domain.entity.Role;
import com.badgerracing.bagder_tasks.domain.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}