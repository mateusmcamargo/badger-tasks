package com.badgerracing.bagder_tasks.domain.entity;

import com.badgerracing.bagder_tasks.domain.enums.AreaName;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity @Table(name = "areas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Area extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private AreaName name;

    private String description;

    // mappedBy tell JPA that the column in User is the owner of the relationship, since
    // it has the @JoinColumn decorator. without it, this would just create a new table
    @OneToMany(mappedBy = "area")
    private List<User> users;
}