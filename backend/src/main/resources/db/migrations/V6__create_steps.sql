CREATE TABLE steps (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR   NOT NULL,
    description VARCHAR,
    task_id     UUID      NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    done        BOOLEAN   NOT NULL DEFAULT FALSE,
    "order"     INTEGER   NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,

    CONSTRAINT uq_step_task_order UNIQUE (task_id, "order")
);