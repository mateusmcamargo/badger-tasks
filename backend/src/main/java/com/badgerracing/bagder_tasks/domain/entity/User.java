package com.badgerracing.bagder_tasks.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

// notes for production:
//
// FetchType.LAZY ensures the data is only loaded when accessed (improves performance)
//
// email and passwords are set to 'nullable = false', so they are required. this was mainly
// do to the issue of having multiple users with email set as 'NULL', which would break the
// app. also, the app was requested as an intern software for the team, so authentication
// is obligatory.

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity{

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String ra;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @OneToMany(mappedBy = "user")
    private List<TaskMember> tasks;
}