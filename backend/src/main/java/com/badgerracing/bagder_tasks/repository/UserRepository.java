package com.badgerracing.bagder_tasks.repository;

import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.domain.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
    Optional<User> findByRa(String ra);
    List<User>     findByAreaId(UUID areaId);

    boolean existsByEmail(String email);
    boolean existsByRa(String ra);

    boolean existsByRoleName(RoleName name);
    boolean existsByRoleNameAndAreaId(RoleName name, UUID areaId);

    // returns all memberss in a given area whose name contains the search string (case-insensitive)
    // excluding users already assigned to the task and the requesting user themselves
    // maybe include users assigned but mark them with a flag in the future?
    @Query("""
        SELECT u FROM User u
        WHERE u.area.id = :areaId
          AND u.role.name = 'MEMBER'
          AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND u.id NOT IN (
              SELECT tm.user.id FROM TaskMember tm WHERE tm.task.id = :taskId
          )
          AND u.id <> :excludeUserId
        ORDER BY u.name
    """)
    List<User> findAssignableMembersForTask(
            @Param("areaId")        UUID areaId,
            @Param("taskId")        UUID taskId,
            @Param("name")          String name,
            @Param("excludeUserId") UUID excludeUserId
    );
}
