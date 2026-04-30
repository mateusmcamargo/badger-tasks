package com.badgerracing.bagder_tasks.domain.enums;

import lombok.Getter;

@Getter
public enum AreaName {

    AERODYNAMICS("Aerodinâmica"),
    DYNAMICS("Dinâmica Veicular"),
    TELEMETRY("Eletrônica e Telemetria"),
    MARKETING("Marketing"),
    STRUCTURE("Estruturas");

    private final String label;

    AreaName(String label) {
        this.label = label;
    }

}
