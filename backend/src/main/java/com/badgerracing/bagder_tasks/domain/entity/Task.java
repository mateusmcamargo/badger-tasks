package com.badgerracing.bagder_tasks.domain.entity;

import com.badgerracing.bagder_tasks.domain.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leader_id", nullable = false)
    private User leader;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    // status here with take the role of a 'done' boolean variable
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    // a task can be inactive because it's not being currently worked on, but it can be active again,
    // so the 'status' field doesn't need to be linked to the 'active' field.
    // active here is used mainly so that users have a clear feedback on if they should or not
    // worry about the task. so if 'active = false', they can disregard it.
    @Column(nullable = false)
    private boolean active;

    private LocalDateTime dateLimit;

    @OneToMany(
        mappedBy = "task",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<TaskMember> members;

    @OneToMany(
        mappedBy = "task",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Step> steps;
}