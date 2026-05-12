package com.badgerracing.bagder_tasks.repository;

import com.badgerracing.bagder_tasks.domain.entity.Area;
import com.badgerracing.bagder_tasks.domain.enums.AreaName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AreaRepository extends JpaRepository<Area, UUID> {
    Optional<Area> findByName(AreaName name);
}