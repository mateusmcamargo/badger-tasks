package com.badgerracing.bagder_tasks.specification;

import com.badgerracing.bagder_tasks.domain.entity.Task;
import com.badgerracing.bagder_tasks.domain.entity.TaskMember;
import com.badgerracing.bagder_tasks.dto.TaskFilterDTO;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class TaskSpecification {

    public static Specification<Task> getFilterSpecification(TaskFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getAreaId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("area").get("id"), filter.getAreaId()));
            }

            if (filter.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), filter.getActive()));
            }

            if (filter.getMemberId() != null) {
                Join<Task, TaskMember> membersJoin = root.join("members");
                predicates.add(criteriaBuilder.equal(membersJoin.get("user").get("id"), filter.getMemberId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
