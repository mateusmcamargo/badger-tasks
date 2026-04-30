package com.badgerracing.bagder_tasks.domain.enums;

import lombok.Getter;

@Getter
public enum RoleName {

    // labels for frontend displaying
    CAPTAIN("Capitão"),
    MANAGER("Gestor"),
    LEADER("Líder"),
    MEMBER("Membro");

    private final String label;

    RoleName(String label) {
        this.label = label;
    }
}