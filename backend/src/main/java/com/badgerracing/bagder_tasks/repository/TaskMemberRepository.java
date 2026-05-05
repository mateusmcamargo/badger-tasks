package com.badgerracing.bagder_tasks.repository;

import com.badgerracing.bagder_tasks.domain.entity.TaskMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskMemberRepository extends JpaRepository<TaskMember, Long> {
    Optional<TaskMember> findByTaskIdAndUserId(Long taskId, Long userId);
    boolean existsByTaskIdAndUserId(Long taskId, Long userId);
}
