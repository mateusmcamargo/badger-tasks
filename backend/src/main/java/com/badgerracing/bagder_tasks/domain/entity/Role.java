package com.badgerracing.bagder_tasks.domain.entity;

import com.badgerracing.bagder_tasks.domain.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity @Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;

    private String description;

    // mappedBy tell JPA that the column in User is the owner of the relationship, since
    // it has the @JoinColumn decorator. without it, this would just create a new table
    @OneToMany(mappedBy = "role")
    private List<User> users;
}