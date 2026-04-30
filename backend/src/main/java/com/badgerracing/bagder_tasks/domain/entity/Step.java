package com.badgerracing.bagder_tasks.domain.entity;

import jakarta.persistence.*;
import lombok.*;

// unique constraints here allows for multiple tasks to have the same order values (eg: 1, 2, 3, ...)
// but makes so one task can't have multiple orders with the same value
@Entity @Table(
        name = "steps",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {
                        "task_id", "order"
                })
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Step extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private boolean done;

    @Column(nullable = false)
    private int order;
}