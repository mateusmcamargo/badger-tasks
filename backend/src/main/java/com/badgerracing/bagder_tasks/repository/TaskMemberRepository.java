package com.badgerracing.bagder_tasks.repository;

import com.badgerracing.bagder_tasks.domain.entity.TaskMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskMemberRepository extends JpaRepository<TaskMember, UUID> {
    Optional<TaskMember> findByTaskIdAndUserId(UUID taskId, UUID userId);
    boolean existsByTaskIdAndUserId(UUID taskId, UUID userId);
}
