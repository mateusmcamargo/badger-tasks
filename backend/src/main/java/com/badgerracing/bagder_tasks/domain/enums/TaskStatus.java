package com.badgerracing.bagder_tasks.domain.enums;

import lombok.Getter;

@Getter
public enum TaskStatus {
    NOT_STARTED("Não Iniciada"),
    IN_PROGRESS("Em progresso"),
    IN_REVISION("Em Revisão"),
    DONE("Concluída");

    private final String label;

    TaskStatus(String label) {
        this.label = label;
    }
}
