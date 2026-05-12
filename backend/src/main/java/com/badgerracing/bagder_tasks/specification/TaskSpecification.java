package com.badgerracing.bagder_tasks.specification;

import com.badgerracing.bagder_tasks.domain.entity.Task;
import com.badgerracing.bagder_tasks.domain.entity.TaskMember;
import com.badgerracing.bagder_tasks.dto.request.TaskFilterRequest;  // ← updated
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class TaskSpecification {

    public static Specification<Task> getFilterSpecification(TaskFilterRequest filter) {  // ← updated
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.areaId() != null) {  // ← record accessor, no get prefix
                predicates.add(criteriaBuilder.equal(root.get("area").get("id"), filter.areaId()));
            }

            if (filter.categoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.categoryId()));
            }

            if (filter.status() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));
            }

            if (filter.active() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), filter.active()));
            }

            if (filter.memberId() != null) {
                Join<Task, TaskMember> membersJoin = root.join("members");
                predicates.add(criteriaBuilder.equal(membersJoin.get("user").get("id"), filter.memberId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}