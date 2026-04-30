package com.badgerracing.bagder_tasks.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "task_members",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "task_id",
                "user_id"
        })
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}